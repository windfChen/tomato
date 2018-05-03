// pages/tomato.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var userUtil = require('../../user')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTime: '',
    status: '',
    nextOption: '开 始',

    // 用于计算
    startTime: 0,
    totalSecond: 25 * 60,
    currentSecond: 0,

    // 用于标记
    intervalId: 0,
    timeOut: false
  },

  userSetting: {},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userSetting = {
      workTime: '25:00',
      restTime: '5:00'
    }

    this.reset()
    userUtil.login((res) => this.addFriend(res,options.fid))
  },

  addFriend: function(res, friendOpenId) {
    if (friendOpenId && friendOpenId != res.userInfo.openId) {

      qcloud.request({
        url: `${config.service.host}/weapp/friend/who`,
        login: true,
        data: { friendOpenId },
        success(result) {
          const friend = result.data.data

          if (friend.userFriend) {
            return
          }
          
          wx.showModal({
            title: '好友添加',
            content: `${friend.nickName}请求添加为好友，添加成功后，可以在好友列表页查看相互的番茄状态，是否同意？`,
            showCancel: true,
            cancelText: '拒绝',
            confirmText: '同意',
            success: function (res) {
              if (res.cancel) {
                return 
              }
              qcloud.request({
                url: `${config.service.host}/weapp/friend/add`,
                method: 'post',
                login: true,
                data: { action: 'save', friendOpenId},
                success(result) {
                  const requestResult = JSON.stringify(result.data);
                  console.log(requestResult)
                },
                fail(error) {
                  // util.showModel('请求失败', error);
                  console.log('request fail', error);
                }
              })
            }
          }) 
        }
      })
      
    }

  },

  reset: function() {
    this.setData({ showTime: this.userSetting.workTime })
    this.setData({ totalSecond: this.changeStr2Second(this.userSetting.workTime) })
  },

  /**
   * 点击事件
   */
  actionTomato: function () { // 还没开始
    if (this.data.status == '' || this.data.status == 'E') {
      /**
       * 开始计时
       */
      this.setData({startTime:new Date().getTime()});
      /**
       * 定时更新
       */
      const interId = setInterval(() => {
        const timeUsed = (new Date().getTime() - this.data.startTime) / 1000;
        this.setData({ currentSecond: this.data.totalSecond - timeUsed});

        if (!this.data.timeOut && this.data.currentSecond <= 0) {
          wx.vibrateLong();
          this.setData({ timeOut:true});
        }

        this.setData({showTime: this.changeSecond2Str(this.data.currentSecond)});
      }, 50);
      this.setData({ intervalId: interId});
      /**
       * 设置状态
       */
      this.setData({status:'S', nextOption: '放 弃'});
    } else if (this.data.status == 'S') { // 已经开始了
      clearInterval(this.data.intervalId);
      this.setData({ status: 'E', nextOption: '开 始', timeOut:false });
      this.reset();
    }

    qcloud.request({
      url: `${config.service.host}/weapp/tomato`,
      login: true,
      data: {status: this.data.status, title: '', note: '' },
      success(result) {
        const requestResult = JSON.stringify(result.data);
        console.log(requestResult)
      },
      fail(error) {
        // util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },


  changeStr2Second: (str) => {
    const ss = str.split(':');
    return ss[0] * 60 + ss[1] * 1;
  },

  changeSecond2Str: (second) => {
    return Math.abs(Math.floor(second / 60)) + ':' + Math.abs(Math.floor(second % 60));
  }

})
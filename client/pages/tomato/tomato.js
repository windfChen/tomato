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
    currentTodo:undefined,
    currentIndex:-1,

    // 用于计算
    startTime: 0,
    totalSecond: 25 * 60,
    currentSecond: 0,

    // 用于标记
    intervalId: 0,
    timeOut: false,

    // 用于存储
    friendOpenID: undefined,
    todos: [],
    logs: []
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

    if (options.fid) {
      this.setData({ friendOpenID: options.fid })
    }
  },

  changeTodo: function () {
    wx.navigateTo({
      url: '/pages/todo/todo'
    })
  },

  loadTodo: function () {
    var todos = wx.getStorageSync('todo_list')
    if (todos) {
      let currentTodo = undefined
      let currentIndex = -1
      for (const i in todos) {
        const td = todos[i]
        if (!td.completed) {
          currentTodo = td
          currentIndex = i
          break
        }
      }
      const data = { 
        todos: todos,
        currentIndex 
      }
      if (currentTodo) {
        data.currentTodo = currentTodo
      }
      this.setData(data)
    }
    var logs = wx.getStorageSync('todo_logs')
    if (logs) {
      this.setData({ logs: logs })
    }
  },

  finishTodo: function (e) {
    var index = e.currentTarget.dataset.index
    var todos = this.data.todos
    todos[index].completed = !todos[index].completed
    var logs = this.data.logs
    logs.push({
      timestamp: new Date(),
      action: todos[index].completed ? '完成' : '重启',
      name: todos[index].name
    })
    this.setData({
      todos: todos,
      logs: logs
    })
    this.save()
    this.loadTodo()
  },

  save: function () {
    wx.setStorageSync('todo_list', this.data.todos)
    wx.setStorageSync('todo_logs', this.data.logs)
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
    var that = this; 
    userUtil.login((res) => {
      if (userUtil.logged) {
        // 加载设置
        that.userSetting = {
          workTime: that.changeSecond2Str(userUtil.userInfo.tomatoTime * 60),
          restTime: that.changeSecond2Str(userUtil.userInfo.breakTime * 60)
        }
        this.setData({ showTime: this.userSetting.workTime })
        this.setData({ totalSecond: this.changeStr2Second(this.userSetting.workTime) })

        // 添加朋友
        this.addFriend(res, that.data.friendOpenID)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.status == 'E' || this.data.status == '') {
      this.reset()
    }
    this.loadTodo()
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
        if (this.data.timeOut) {
          return
        }

        const timeUsed = (new Date().getTime() - this.data.startTime) / 1000;
        this.setData({ currentSecond: this.data.totalSecond - timeUsed});

        if (!this.data.timeOut && this.data.currentSecond <= 0) {
          wx.vibrateLong();
          this.setData({ timeOut: true, nextOption: '休 息',});
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

    let stat = this.data.status
    if (stat == 'E' && !this.data.timeOut) {
      stat = 'C'
    }
    qcloud.request({
      url: `${config.service.host}/weapp/tomato`,
      login: true,
      data: { status: stat, title: this.data.currentTodo ? this.data.currentTodo.name : undefined },
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
    const ss = str.split(':')
    return ss[0] * 60 + ss[1] * 1
  },

  changeSecond2Str: (second) => {
    let minStr = Math.abs(Math.floor(second / 60))
    if (minStr < 10) {
      minStr = '0' + minStr
    }
    let secStr = Math.abs(Math.floor(second % 60))
    if (secStr < 10) {
      secStr = '0' + secStr
    }
    return minStr + ':' + secStr
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    return {
      title: '协作番茄，只专注做一件事',
      path: `/pages/tomato/tomato?fid=${userUtil.userInfo.openId}`,
      imageUrl: '/pages/friend/share.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

})
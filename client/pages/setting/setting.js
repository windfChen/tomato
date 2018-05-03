// pages/setting/setting.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var userUtil = require('../../user')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    breakTime: 0,
    tomatoTime: 0
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    userUtil.login(() => {
      if (userUtil.logged) {
        that.setData({
          breakTime: userUtil.userInfo.breakTime,
          tomatoTime: userUtil.userInfo.tomatoTime
        })
      }
    })
  },

  cancel: function () {
    wx.navigateBack()
  },

  save: function() {
    const that = this

    util.showBusy('正在提交')
    qcloud.request({
      url: `${config.service.host}/weapp/setting/save`,
      method: 'post',
      login: true,
      data: { breakTime: this.data.breakTime, tomatoTime: this.data.tomatoTime },
      success(result) {
        util.showSuccess('提交成功')

        userUtil.userInfo.tomatoTime = that.data.tomatoTime
        userUtil.userInfo.breakTime = that.data.breakTime

        wx.navigateBack()
      },
      fail(error) {
        // util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },
  
  updateValue: function (e) {
    const o = {}
    o[e.target.dataset.name] = e.detail.value
    this.setData(o)
  }
})
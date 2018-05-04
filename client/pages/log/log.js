// pages/log/log.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var userUtil = require('../../user')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toamtoLog:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData()
  },

  loadData: function () {
    userUtil.login(() => {
      if (userUtil.logged) {
        wx.showLoading({
          title: '加载数据中',
          mask: true
        })
        qcloud.request({
          url: `${config.service.host}/weapp/tomato/list`,
          login: true,
          success: result => {
            wx.hideLoading()
            const toamtoLog = result.data.data
            this.setData({ toamtoLog })
          },
          fail(error) {
            // util.showModel('请求失败', error);
            console.log('request fail', error);
          }
        })
      }
    })
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
// pages/friend/friend.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var userUtil = require('../../services/user')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friends:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  getFriends : function () {
    qcloud.request({
      url: `${config.service.host}/weapp/friend/list`,
      login: false,
      success: result => {
        console.log(result.data.data)
        const friends = result.data.data
        this.setData({ friends })
      },
      fail(error) {
        // util.showModel('请求失败', error);
        console.log('request fail', error);
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
      imageUrl:'/pages/friend/share.png',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getFriends()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }
})
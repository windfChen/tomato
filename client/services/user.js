
var qcloud = require('../vendor/wafer2-client-sdk/index')
var config = require('../config')
var util = require('../utils/util')

const e = {
  logged : false,
  userInfo : undefined

}

const login = function (callback) {
  // 如果已经登录，不在登录,直接调用
  if (e.logged) {
    if (callback) {
      callback(e)
    }
    return
  }

  wx.showLoading({
    title: '正在登陆',
    mask: true
  })
  qcloud.request({
    url: config.service.requestUrl,
    login: true,
    success(result) {
      wx.hideLoading()
      console.log('request success', result.data.data)
      e.userInfo = result.data.data
      e.logged = true

      if (callback) {
        callback(e)
      }
    },

    fail(error) {
      wx.showModal({
        title: '网络错误',
        content: `小程序未正式上线，如果要预览请点击...打开调试模式,然后再次打开小程序,否则将无法使用网络功能`,
        showCancel: false
      }) 
      // util.showModel('登录失败', error)
      console.log('request fail', error)
    }
  })
}

e.login = login


module.exports = e

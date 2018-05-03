
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var util = require('./utils/util.js')

const e = {
  logged : false,
  userInfo : undefined

}
const register = function() {
  if (logged) return

  util.showBusy('正在登录')
  var that = this

  // 调用登录接口
  qcloud.login({
    success(result) {
      if (result) {
        util.showSuccess('登录成功!')
        e.userInfo = result
        e.logged = true
      } else {
        // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
        login();
      }
    },

    fail(error) {
      // util.showModel('登录失败', error)
      console.log('登录失败', error)
    }
  })

}
const login = function (callback) {
  qcloud.request({
    url: config.service.requestUrl,
    login: true,
    success(result) {
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

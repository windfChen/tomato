var dialog = require('./dialog')
var util = require('./util')
var requestLib = require('../vendor/wafer2-client-sdk/lib/request')
var loginLib = require('../vendor/wafer2-client-sdk/lib/login')

const defaultOptions = {
  login: true,
  method: 'get',
  waitMsg: undefined
}

/**
 * http请求
 * @param {Object} options 请求配置
 * @param {string} options.url 请求的地址，绝对路径
 * @param {boolean} [options.busy]  是否显示遮罩，提示请求，默认显示
 * @param {string} [options.waitMsg] 等待是提示的消息，默认为加载中(get方法)和提交中(post方法)
 * @param {string} [options.method] 请求使用的 HTTP 方法，默认为 "GET"
 * @param {boolean} [options.login]  是否需要登录，如果需要，当未登录时，先登录，默认需要登录
 * @param {Function} options.success(data) 请求成功后的回调函数，参数 userInfo 微信用户信息
 * @param {Function} [options.fail(error)] 请求失败后的回调函数，参数 error 错误信息
 * @param {Function} [options.complete(error)] 无论请求成功与否都执行的函数
 */
const request = (options) => {
  config = util.extend({}, defaultOptions, options)

  // 动态参数
  if (!config.waitMsg) {
    config.waitMsg = config.method == 'get' ? '加载中' : '提交中'
  }

  dialog.showBusy(config.waitMsg) // 开始加载

  // 发出请求
  requestLib.request(util.extend({}, config, {
    complete: function() {
      dialog.hideBusy() // 加载完成
      config.complete.apply(null, arguments)
    }
  }))
}

/**
 * 登录之后执行一些方法
 * @param {Function} handle 登录之后执行的方法
 */
const afterLogin = (handle) => {
  loginLib.login({
    success: function (userInfo) {
      handle.apply(null, arguments)
    }
  })
}

module.exports = { request, afterLogin }
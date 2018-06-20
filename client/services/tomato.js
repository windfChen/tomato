var util = require('../utils/util.js')
var net = require('../utils/net.js')
var config = require('../config')

const defaultOptions = {
  success: util.noop,
  cancel: util.noop,
  setData: util.noop
}

let options = {
  setData: util.noop
}

// 番茄状态
const tomato = {
  status: 'N',  // 未开始：'N',超时：'E',已开始：'S',休息：'B'
  showTime: '00:00',  // 显示的时间
}

// 番茄设置
let userSetting = {
  tomatoTime: 25 * 60, // 番茄工作时间
  breakTime: 5 * 60  // 番茄休息时间
}

let remainingTime = userSetting.tomatoTime // 距离番茄结束剩余的时间，定时更新，初始为工作时间
let intervalId = undefined  // 当前定时任务的id，用于取消定时任务

let currentTodo = {}  // 当前的土豆，暂时还没用到

/**
 * 初始化番茄
 */
const init = function(opt) {
  options = util.extend({}, defaultOptions, opt)
  reflashData()
}

/**
 * 获取番茄状态
 */
const getTomatoData = function () {
  return util.extend({}, tomato, {
    showTime: changeSecond2Str(remainingTime)
  })
}

/**
 * 刷新番茄状态数据，传送给钩子函数
 */
const reflashData = function(data) {
  options.setData(util.extend({}, getTomatoData(), data? data: {}));
}

/**
 * 更新番茄设置
 */
const updateUserSetting = function(us) {
  util.extend(userSetting, us)
  resetTomato()
}

/**
 * 修改番茄状态
 */
const changeStatus = function() {
  /*
   * 判断当前状态，执行修改番茄状态
   */
  if (tomato.status == 'N') {  // 未开始
    startTomato()
  } else if (tomato.status == 'S') { // 已经开始了，而且未到达指定时间
    cancelTomato()
  } else if (tomato.status == 'E') {
    endTomato()
  } else if (tomato.status == 'B') {
    resetTomato()
  }
  // 同步番茄
  syncTomato()
}

/**
 * 修改番茄状态
 */
const startTomato = function () {
  // 设置状态:当前状态为已开始
  tomato.status = 'S'
  // 定时更新时间
  timeUpdate(userSetting.tomatoTime, () => {
    if(tomato.status == 'S') {
      remind() // 提醒
      tomato.status = 'E' // 结束
    }
  })
}
const cancelTomato = function () {
  // 和用户确认中断
  wx.showModal({
    title: '中断番茄',
    content: '确认要中断番茄吗？',
    showCancel: true,
    cancelText: '继续',
    cancelColor: '#3CC51F',
    confirmText: '中断',
    confirmColor: '#000000',
    success: (res) => {
      if (res.confirm) {
        resetTomato()
      }
    }
  })
}
const endTomato = function () {
  // 停止提醒
  stopRemind()
  // 开始休息
  breakTomato()
}
const resetTomato = function () {
  // 取消定时
  cancelTimeUpdate()
  // 设置状态
  tomato.status = 'N'
  // 重置时间
  remainingTime = userSetting.tomatoTime
  // 刷新状态
  reflashData()
}
const breakTomato = function () {
  // 设置番茄状态
  tomato.status = 'B'
  // 开始计时
  timeUpdate(userSetting.breakTime, () => {
    resetTomato() // 重置番茄
  })
}

/**
 * 定时计算当前时间，超时后，更新状态
 */
const timeUpdate = function (totalTime, timeEnd = util.noop) {
  // 计时开始时间，用于时间显示和计算等
  let startTime = new Date().getTime()
  // 定时更新
  intervalId = setInterval(() => {
    // 计算当前时间
    remainingTime = totalTime - ((new Date().getTime() - startTime) / 1000)
    // 如果超时，执行timeEnd方法
    if (remainingTime <= 0) {
      timeEnd()
      remainingTime = 0 // 时间归0
      cancelTimeUpdate()  // 取消计时
    }
    // 刷新状态
    reflashData()
  }, 500);
}
const cancelTimeUpdate = function() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = undefined
  }
}

// 同步番茄状态，到服务器
const syncTomato = () => {
  return 
  net.request({
    url: `${config.service.host}/weapp/tomato`,
    login: true,
    data: { status: tomato.status, title: currentTodo ? currentTodo.name : '没有番茄' },
    success(result) {
      const requestResult = JSON.stringify(result.data);
      console.log(requestResult)
    },
    fail(error) {
      console.log('request fail', error);
    }
  })
}

/**
 * 提醒
 */
const remind = function () {
  wx.vibrateLong()  // 手机振动
  wx.vibrateLong()  // 手机振动
  wx.vibrateLong()  // 手机振动
  // playAudio() // 播放铃声
}
const stopRemind = function () {
  stopAudio()
}

/**
 * 铃声播放
 */
let audioContext = undefined
const playAudio = function() {
  audioContext = wx.getBackgroundAudioManager()
  audioContext.src = 'https://pic.ibaotu.com/00/43/53/45f888piCKwS.mp3'
  audioContext.play()
  audioContext.onTimeUpdate(() => {
    if (audioContext.currentTime > 10) {
      stopAudio()
    }
  })
}
const stopAudio = function() {
  if (audioContext) {
    audioContext.stop()
    // audioContext.destroy()
  }
}

const changeStr2Second = (str) => {
  const ss = str.split(':')
  return ss[0] * 60 + ss[1] * 1
}
const changeSecond2Str = (second) => {
  let minStr = Math.floor(second / 60)
  if (minStr < 0) {
    minStr = minStr + 1
  }
  if (minStr < 10) {
    minStr = '0' + minStr
  }
  let secStr = Math.abs(Math.floor(second % 60))
  if (secStr < 10) {
    secStr = '0' + secStr
  }
  return minStr + ':' + secStr
}

module.exports = {
  init,
  changeStatus,
  updateUserSetting,
  playAudio
}
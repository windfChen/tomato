// pages/tomato.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var userUtil = require('../../services/user')
var util = require('../../utils/util.js')
var net = require('../../utils/net.js')
var tomato = require('../../services/tomato.js')
var friend = require('../../services/friend.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTime: '',
    status: '',

    hideTodo: false,
    currentTodo: undefined,
    currentIndex: -1,
    todos: [],
    logs: [],

    // 用于存储
    friendOpenID: undefined
  },

  initTomato: function () {
    tomato.init({
      setData: (data) => {
        this.setData(data)
      }
    })

    this.resetTomato()
  },

  resetTomato: function() {
    // 更新番茄设置
    net.afterLogin((userInfo) => {
      tomato.updateUserSetting({
        tomatoTime: userInfo.tomatoTime * 60,
        breakTime: userInfo.breakTime * 60
      })
    })
  },

  /**
   * 点击事件番茄控制按钮
   */
  actionTomato: function () {
    tomato.changeStatus()
  },

  resetTodo: function () {
    net.afterLogin((userInfo) => {
      // 加载设置
      this.setData({ hideTodo: userInfo.hideTodo == 1 })
    })
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

  addFriend: function (userInfo, friendOpenId) {
    if (friendOpenId && friendOpenId != userInfo.openId) {

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



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载番茄
    this.initTomato()
    // 加载朋友
    if (options.fid) {
      this.setData({ friendOpenID: options.fid })
    }
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
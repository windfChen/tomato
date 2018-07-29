var util = require('../utils/util.js')
var net = require('../utils/net.js')
var config = require('../config')

const addFriend = function (userInfo, friendOpenId) {
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
              data: { action: 'save', friendOpenId },
              success(result) {
                const requestResult = JSON.stringify(result.data);
                console.log(requestResult)
              },
              fail(error) {
                console.log('request fail', error);
              }
            })
          }
        })
      }
    })

  }

}

export {
  addFriend
}
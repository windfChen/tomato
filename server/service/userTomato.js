// 用户的番茄记录
const { db } = require('../database')
const userService = require('../service/user.js')

module.exports = {
  start: async (openId) => {
    const user = await userService.findByOpenId(openId);
    user.tomatoStartTime = new Date()
    user.tomatoStatus = 'S'
    userService.update(user.id, user)
  },

  end: async (openId, tomato) => {
    const user = await userService.findByOpenId(openId)

    tomato.fk_user_id = user.id
    tomato.create_date = user.tomatoStartTime
    tomato.end_date = new Date()

    await db('user_tomato').insert(tomato)

    user.tomatoStatus = tomato.status
    await userService.update(user.id, user)
  },

  list: async (userId) => {
    var res = mysql("user_tomato").list()
    return res;
  }

}
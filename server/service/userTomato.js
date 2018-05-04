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
    const list = await db("user_tomato").where({ fk_user_id: userId })

    for (var i in list) {
      const userTomato = list[i]
      const startTime = userTomato.create_date
      const endTime = userTomato.end_date

      userTomato.date = startTime.getFullYear() + '-' + (startTime.getMonth() + 1) + '-' + startTime.getDate()
      userTomato.week = '星期' + startTime.getDay() + 1
      userTomato.timeStart = startTime.getHours() + ':' + startTime.getMinutes()
      userTomato.tiemEnd = endTime.getHours() + ':' + endTime.getMinutes()
      userTomato.secondUse = (startTime.getTime() - endTime.getTime()) / 1000
    }

    return list
  }

}
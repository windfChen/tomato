const { db } = require('../database')
const userService = require('../service/user.js')
const userTomatoService = require('../service/userTomato.js')


module.exports = async ctx => {
  const { title, status, note } = ctx.query

  const ls = userService.userSession.loginState
  const openId = userService.userSession.openId;

  if (openId === undefined) {
    ctx.state.data = {
      msg: `用户未登录`
    }
    return
  }

  if (status == 'S') {
    await userTomatoService.start(openId)
  } else if (status == 'E' || status == 'C') {
    const tomato = {
      title,
      note,
      status
    }

    await userTomatoService.end(openId, tomato)
  }
  
  ctx.state.data = {
    msg: `提交成功`
  }
  
  

  
}
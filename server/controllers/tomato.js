const { db } = require('../database')
const userService = require('../service/user.js')
const userTomatoService = require('../service/userTomato.js')


const save = async ctx => {
  const { title, status, note } = ctx.query

  const ls = userService.getCurrentUser(ctx).loginState
  const openId = userService.getCurrentUser(ctx).openId;

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

const list = async ctx => {
  const {  } = ctx.query

  const ls = userService.getCurrentUser(ctx).loginState
  const userId = userService.getCurrentUser(ctx).id;

  const list = await userTomatoService.list(userId)

  ctx.state.data = list
}

module.exports = {
  save,
  list
}
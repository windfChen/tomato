const { db } = require('../database')
const userService = require('../service/user.js')
const friendService = require('../service/friend.js')


const add = async ctx => {
  const { friendOpenId} = ctx.request.body

  const ls = userService.getCurrentUser(ctx).loginState
  const openId = userService.getCurrentUser(ctx).openId;

  if (openId === undefined) {
    ctx.state.data = {
      msg: `用户未登录`
    }
    return 
  }

  await friendService.save(openId, friendOpenId)

  ctx.state.data = {
    msg: `添加成功`
  }

}

const list = async ctx => {
  const userId = userService.getCurrentUser(ctx).id

  if (userId === undefined) {
    ctx.state.data = {
      msg: `用户未登录`
    }
    return 
  }

  const friendList = await friendService.getByUserId(userId)

  ctx.state.data = friendList
 
}

const getFriendByOpenId = async ctx => {
  const { friendOpenId } = ctx.query

  const ls = userService.getCurrentUser(ctx).loginState
  const userId = userService.getCurrentUser(ctx).id

  if (ls === 0) {
    ctx.state.data = {
      msg: `用户未登录`
    }
    return 
  }

  const friend = await friendService.getFriendUser(userId, friendOpenId)

  ctx.state.data = friend
  ctx.state.data[0].d = ctx.session.user.id
}

module.exports = {
  add,
  list,
  who: getFriendByOpenId
}

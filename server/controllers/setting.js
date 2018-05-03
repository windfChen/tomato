const { db } = require('../database')
const userService = require('../service/user.js')


const save = async ctx => {
  const { breakTime, tomatoTime } = ctx.request.body

  const ls = userService.getCurrentUser(ctx).loginState
  const userId = userService.getCurrentUser(ctx).id;

  if (userId === undefined) {
    ctx.state.data = {
      msg: `用户未登录`
    }
    return
  }

  await userService.updateColumn(userId, { breakTime, tomatoTime } )

  ctx.state.data = {
    msg: `修改成功`
  }

}

module.exports = {
  save
}

const userService = require('../service/user.js')

const verify = async (ctx, next) => {
  // 通过 Koa 中间件进行登录态校验之后
  // 登录信息会被存储到 ctx.state.$wxInfo
  // 具体查看：
  if (ctx.state.$wxInfo.loginState === 1) {
    // loginState 为 1，登录态校验成功
    await userService.setUserSession(ctx, ctx.state.$wxInfo.userinfo)

    ctx.state.data = userService.getCurrentUser(ctx)
  } else {
    ctx.state.code = -1
  }
}

module.exports = {
  verify
}

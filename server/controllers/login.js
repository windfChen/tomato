const userService = require('../service/user')
const util = require('../util/util')


// 登录授权接口
module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
  if (ctx.state.$wxInfo.loginState) {
    await userService.setUserSession(ctx, ctx.state.$wxInfo.userinfo.userinfo)

    const userInfo = userService.getCurrentUser(ctx)
    util.extend(ctx.state.$wxInfo.userinfo.userinfo, userInfo)
    ctx.state.data = ctx.state.$wxInfo.userinfo
    ctx.state.data['time'] = Math.floor(Date.now() / 1000)
  }
}

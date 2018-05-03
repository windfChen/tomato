const Koa = require('koa')
const app = new Koa()
const debug = require('debug')('koa-weapp-demo')
const response = require('./middlewares/response')
const bodyParser = require('koa-bodyparser')
const config = require('./config')
const session = require('koa-session')

// 使用响应处理中间件
app.use(response)

// 解析请求体
app.use(bodyParser())

// 引入路由分发
const router = require('./routes')
app.use(router.routes())

// 使用session

app.use(session({
  key: "SESSIONID",   //default "koa:sid" 
  expires: 3, //default 7 
  maxAge: 86400000,
  path: "/" //default "/"
}, app));

// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`))

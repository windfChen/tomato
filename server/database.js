const { mysql: config } = require('./config');
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.pass,
    database: config.db,
    charset: config.char,
    multipleStatements: true
  }
});

const { mysql } = require('./qcloud')

// 初始化 SDK
// 将基础配置和 sdk.config 合并传入 SDK 并导出初始化完成的 SDK
module.exports = {
  db: mysql
}

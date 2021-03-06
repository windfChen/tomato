// 用户操作
const { db } = require('../database')
const session = require('../frame/session')

const save = async (user) => {
  await db('user').insert(user)
}

const findByOpenId = async (openId) => {
  let users = await db('user').where({ openId })

  let user

  if (users.length == 0) {
    user = await createUserBySessionUser(openId)
  } else {
    user = users[0];
  }

  return user
}

const update = async (id, user) => {
  await db('user').update(user).where({ id })
}

const updateColumn = async (id, userInfo, ctx = false) => {
  let user = await db('user').where({ id }).first()
  for (var i in userInfo) {
    user[i] = userInfo[i];
  }
  await update(id, user)
  if (ctx) {
    setUserSession(ctx, user)
  }
} 

const createUserBySessionUser = async (openId) => {
  const sessionInfo = await db('cSessionInfo').where({ open_id: openId }).first()
  const user = JSON.parse(sessionInfo.user_info)

  const u = {}
  u.openId = user.openId
  u.nickName = user.nickName
  u.avatarUrl = user.avatarUrl
  u.gender = user.gender
  u.country = user.country
  u.province = user.province
  u.city = user.city

  u.id = await db('user').insert(u)
  return u
}

const setUserSession = async (ctx, userInfo) => {
  const user = await findByOpenId(userInfo.openId)
  user.loginState = 1
  session.set(ctx, 'user', user)
}

const getCurrentUser = (ctx) => {
  return session.get(ctx, 'user')
}

module.exports = {
  userSession: { loginState: 0 },
  save,
  findByOpenId,
  update,
  setUserSession,
  getCurrentUser,
  updateColumn
}
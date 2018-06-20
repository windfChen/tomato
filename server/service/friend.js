// 用户操作
const { db } = require('../database')
const userService = require('../service/user')
const tableName = 'user_friend'

const save = async (openId, friendOpenId) => {
  const user = await userService.findByOpenId(openId)
  const friend = await userService.findByOpenId(friendOpenId)

  if (user == null || friend == null) {
    return
  }

  let userFriend = await getByUserIdAndFriendId(user.id, friend.id)
  if (userFriend == null) {
    const now = new Date()

    userFriend = {
      fk_user_id: user.id,
      fk_friend_id: friend.id,
      createDate: now,
      updateDate: now,
      status: '1'
    }
    await db(tableName).insert(userFriend)
    userFriend = {
      fk_user_id: friend.id,
      fk_friend_id: user.id,
      createDate: now,
      updateDate: now,
      status: '1'
    }
    await db(tableName).insert(userFriend)
  }
}

const getByUserIdAndFriendId = async (userId, friendId) => {
  let resu = await db(tableName).where({ fk_user_id: userId, fk_friend_id: friendId })
  if (resu.length > 0) {
    resu = resu[0]
  } else {
    resu = null
  }
  return resu
}

const getByUserId = async (userId) => {
  return await db(tableName)
    .join('user', 'user.id', '=', `${tableName}.fk_friend_id`)
    .where({ fk_user_id: userId })
}

const getFriendUser = async (userId, friendOpenId) => {
  const friend = await userService.findByOpenId(friendOpenId)
  const userFriend = await getByUserIdAndFriendId(userId, friend.id)
  if (userFriend) {
    friend.userFriend = userFriend
  }
  return friend
}

module.exports = {
  save,
  getByUserId,
  getFriendUser
}
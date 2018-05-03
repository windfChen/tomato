const sessionStorage = {};

const get = (ctx, key) => {
  return getSession(ctx)[key]
}

const set = (ctx, key, value) => {
  getSession(ctx)[key] = value
}

const getSession = (ctx) => {
  let session = sessionStorage[getKey(ctx)]
  if (!session) {
    session = {}
    sessionStorage[getKey(ctx)] = session
  }
  return session
}
const getKey = (ctx) => {
  return ctx.request.headers['x-wx-skey']
}

module.exports = {
  get,
  set
}

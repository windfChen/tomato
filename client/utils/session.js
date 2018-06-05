const sessionLib = require('../vendor/wafer2-client-sdk/lib/session.js')

module.exports = { 
  get: sessionLib.get,
  set: sessionLib.set,
  clear: sessionLib.clear
}

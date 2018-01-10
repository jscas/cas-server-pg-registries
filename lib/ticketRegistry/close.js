'use strict'

module.exports.name = 'close'
module.exports.method = function (pool, log) {
  return async function close () { return true }
}

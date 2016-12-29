'use strict'

module.exports.name = 'close'
module.exports.method = function (pool, log, Promise) {
  return function close () { return Promise.resolve() }
}

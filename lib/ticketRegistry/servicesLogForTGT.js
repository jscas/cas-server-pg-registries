'use strict'

module.exports.name = 'servicesLogForTGT'
module.exports.method = function (pool, log, Promise) {
  return require('./getServices')(pool, log, Promise)
}

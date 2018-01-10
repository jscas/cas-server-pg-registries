'use strict'

module.exports.name = 'servicesLogForTGT'
module.exports.method = function (pool, log) {
  return require('./getServices')(pool, log)
}

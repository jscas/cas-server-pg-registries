'use strict'

const registry = require('./lib/serviceRegistry')

module.exports.name = 'pgServiceRegistry'
module.exports.plugin = function plugin (conf, context) {
  return registry(
    context.dataSources.postgres,
    context.logger.child({plugin: 'pgServiceRegistry'}),
    context.Promise
  )
}

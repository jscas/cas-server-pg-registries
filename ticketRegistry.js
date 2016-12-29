'use strict'

const registry = require('./lib/ticketRegistry')

module.exports.name = 'pgTicketRegistry'
module.exports.plugin = function plugin (conf, context) {
  return registry(
    context.dataSources.postgres,
    context.logger.child({plugin: 'pgTicketRegistry'}),
    context.Promise
  )
}

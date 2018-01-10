'use strict'

const fp = require('fastify-plugin')
const registryFactory = require('./lib/ticketRegistry')

module.exports = fp(function ticketRegistryPlugin (server, options, next) {
  const registry = registryFactory(server.pg, server.log)
  server.registerTicketRegistry(registry)
  next()
})
module.exports.pluginName = 'pgTicketRegistry'

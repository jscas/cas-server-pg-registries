'use strict'

const fp = require('fp')
const registryFactory = require('./lib/serviceRegistry')

module.exports = fp(function serviceRegistryPlugin (server, options, next) {
  const registry = registryFactory(server.pg, server.log)
  server.registerServiceRegistry(registry)
  next()
})

module.exports.pluginName = 'pgServiceRegistry'

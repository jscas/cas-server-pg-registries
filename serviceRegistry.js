'use strict'

const fp = require('fastify-plugin')
const registryFactory = require('./lib/serviceRegistry')
const defaults = {
  useRegexUrls: false
}

module.exports = fp(function serviceRegistryPlugin (server, options, next) {
  const opts = Object.assign({}, defaults, options)
  const registry = registryFactory(server.pg, server.log, options.useRegexUrls)
  server.registerServiceRegistry(registry)
  next()
})

module.exports.pluginName = 'pgServiceRegistry'

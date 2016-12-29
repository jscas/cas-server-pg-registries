'use strict'

const fs = require('fs')

module.exports = function (pool, log, Promise) {
  log.trace('loading ticket registry method files')
  const registry = {}
  const exclude = ['index.js', 'getServices.js']
  try {
    const files = fs.readdirSync(__dirname)
    files.filter((f) => exclude.indexOf(f) === -1).forEach((f) => {
      log.trace('loading method file: %s', f)
      const component = require(require.resolve(`./${f}`))
      registry[component.name] = component.method(pool, log, Promise)
    })
  } catch (e) {
    log.error('could not load ticket registry: %s', e.message)
    log.debug(e.stack)
  }
  log.trace('ticket registry method files loaded')
  return registry
}

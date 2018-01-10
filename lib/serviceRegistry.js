'use strict'

const tables = require('./tableNames')

const serviceWithNameSql =
`select id, name, url, comment from ${tables.services} where name = $1::text`

const serviceWithUrlSql =
`select id, name, url, comment from ${tables.services} where url = $1::text`

module.exports = function (pool, log) {
  async function getServiceWithName (name) {
    log.trace('getting service with name: %s', name)
    try {
      const result = await pool.query(serviceWithNameSql, [name])
      if (result.rows.length === 0) {
        log.trace('no services found for name: %s', name)
        throw Error('no service found')
      }
      log.trace('found service: %j', result.rows[0])
      return result.rows[0]
    } catch (e) {
      log.error('could not find service named `%s`: %s', name, e.message)
      log.debug(e.stack)
      throw e
    }
  }

  async function getServiceWithUrl (url) {
    log.trace('getting service with url: %s', url)
    try {
      const result = await pool.query(serviceWithUrlSql, [url])
      if (result.rows.length === 0) {
        log.trace('could not find service with url: %s', url)
        throw Error(`unknown service: ${url}`)
      }
      log.trace('found service: %j', result.rows[0])
      return result.rows[0]
    } catch (e) {
      log.error('could not find service with url `%s`: %s', url, e.message)
      log.debug(e.stack)
      throw e
    }
  }

  return {
    getServiceWithName,
    getServiceWithUrl,
    close: async function close () {
      return true
    }
  }
}

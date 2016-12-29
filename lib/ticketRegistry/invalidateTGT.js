'use strict'

const tables = require('../tableNames')

const sql =
`
update ${tables.tgt} set valid = false
  where tid = $1
  returning created, expires, valid, userid as "userId"
`

module.exports.name = 'invalidateTGT'
module.exports.method = function (pool, log, Promise) {
  const getServices = require('./getServices')(pool, log, Promise)

  function * invalidateTGT (tgtId) {
    log.trace('invalidating tgt: %s', tgtId)
    try {
      const result = yield pool.query(sql, [tgtId])
      log.trace('invalidated tgt: %s', tgtId)
      const services = yield getServices(tgtId)
      return {
        tid: tgtId,
        created: result.rows[0].created,
        expires: result.rows[0].expires,
        valid: result.rows[0].valid,
        userId: result.rows[0].userId,
        services: services
      }
    } catch (e) {
      log.error('could not invalidate tgt `%s`: %s', tgtId, e.message)
      log.debug(e.stack)
      throw e
    }
  }
  return Promise.coroutine(invalidateTGT)
}

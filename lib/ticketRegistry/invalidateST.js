'use strict'

const tables = require('../tableNames')

const sql =
`
update ${tables.st} set valid = false
  where tid = $1
  returning
    created,
    expires,
    valid,
    tgt_id as "tgtId",
    (
      select name as "serviceId"
      from ${tables.services}
      where id = service_id
    )
`

module.exports.name = 'invalidateST'
module.exports.method = function (pool, log, Promise) {
  function * invalidateST (stId) {
    log.trace('invalidating st: %s', stId)
    try {
      const result = yield pool.query(sql, [stId])
      log.trace('invalidated st: %s', stId)
      return {
        tid: stId,
        created: result.rows[0].created,
        expires: result.rows[0].expires,
        valid: result.rows[0].valid,
        tgtId: result.rows[0].tgtId,
        serviceId: result.rows[0].serviceId
      }
    } catch (e) {
      log.error('could not invalidate st `%s`: %s', stId, e.message)
      log.debug(e.stack)
      throw e
    }
  }
  return Promise.coroutine(invalidateST)
}

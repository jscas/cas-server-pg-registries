'use strict'

const tables = require('../tableNames')

const sql =
`
select
  tid,
  service_id as "serviceId",
  tgt_id as "tgtId",
  created,
  expires,
  valid
from ${tables.st} where tgt_id = $1
`

module.exports.name = 'getSTbyTGT'
module.exports.method = function (pool, log, Promise) {
  function * getSTbyTGT (tgtId) {
    log.trace('retrieving st for tgt: %s', tgtId)
    try {
      const result = yield pool.query(sql, [tgtId])
      if (result.rows.length === 0) {
        log.trace('could not find st for tgt: %s', tgtId)
        return []
      }
      log.trace('service tickets found: %s', result.rows.length)
      return result.rows
    } catch (e) {
      log.error('could not find st for tgt `%s`: %s', tgtId, e.message)
      log.debug(e.stack)
      throw e
    }
  }
  return Promise.coroutine(getSTbyTGT)
}

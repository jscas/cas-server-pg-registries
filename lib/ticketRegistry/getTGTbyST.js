'use strict'

const tables = require('../tableNames')

const sql =
`
select
  a.tid,
  a.userid AS "userId",
  a.valid,
  a.created,
  a.expires
from ${tables.tgt} a
join ${tables.st} b
  on b.tgt_id = a.tid
  and b.tid = $1
`

module.exports.name = 'getTGTbyST'
module.exports.method = function (pool, log, Promise) {
  const getServices = require('./getServices')(pool, log, Promise)

  function * getTGTbyST (stId) {
    log.trace('retrieving tgt for st: %s', stId)
    try {
      const result = yield pool.query(sql, [stId])
      if (result.rows.length === 0) {
        log.trace('could not find tgt for st: %s', stId)
        throw new Error('ticket granting ticket missing for service ticket')
      }
      const retVal = Object.assign({}, result.rows[0])
      retVal.services = yield getServices(retVal.tid)
      return retVal
    } catch (e) {
      log.error('could not retrieve tgt for st `%s`: %s', stId, e.message)
      log.debug(e.stack)
      throw e
    }
  }
  return Promise.coroutine(getTGTbyST)
}

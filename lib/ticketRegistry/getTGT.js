'use strict'

const tables = require('../tableNames')

const tgtSql =
`
select
  tid,
  userid as "userId",
  created,
  expired,
  valid
from ${tables.tgt} where tid = $1
`

module.exports.name = 'getTGT'
module.exports.method = function (pool, log, Promise) {
  const getServices = require('./getServices')(pool, log, Promise)

  function * getTGT (tgtId) {
    log.trace('retrieving tgt: %s', tgtId)
    try {
      const result = yield pool.query(tgtSql, [tgtId])
      if (result.rows.length === 0) {
        log.trace('could not find tgt: %s', tgtId)
        throw new Error('requested ticket not found')
      }
      log.trace('found tgt: %s', tgtId)
      const tgt = result.rows[0]
      tgt.services = yield getServices(tgtId)
      return tgt
    } catch (e) {
      log.error('could not find tgt `%s`: %s', tgtId, e.message)
      log.debug(e.stack)
      throw e
    }
  }
  return Promise.coroutine(getTGT)
}

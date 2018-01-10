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
from ${tables.st} where tid = $1
`

module.exports.name = 'getST'
module.exports.method = function (pool, log) {
  async function getST (stId) {
    log.trace('retrieving st with id: %s', stId)
    try {
      const result = await pool.query(sql, [stId])
      if (result.rows.length === 0) {
        log.trace('could not find st with id: %s', stId)
        throw new Error('could not find service ticket')
      }
      return result.rows[0]
    } catch (e) {
      log.error('could not find st `%s`: %s', stId, e.message)
      log.debug(e.stack)
      throw e
    }
  }
  return getST
}

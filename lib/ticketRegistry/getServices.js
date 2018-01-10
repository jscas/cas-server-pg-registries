'use strict'

const tables = require('../tableNames')

const servicesSql =
`
select
  c.id as "serviceId",
  case
    when c.slourl is null then c.url
    when c.slourl = '' then c.url
    else c.slourl
  end as "logoutUrl"
from ${tables.tracking} a
join ${tables.st} b
  on b.tgt_id = a.tgt_tid
join ${tables.services} c
  on c.id = b.service_id
where a.tgt_tid = $1
group by c.id
`

module.exports = function (pool, log) {
  async function getServices (tgtId) {
    log.trace('retrieving services for tgt: %s', tgtId)
    try {
      const result = await pool.query(servicesSql, [tgtId])
      log.trace('number of services found: %s', result.rows.length)
      return result.rows
    } catch (e) {
      log.error('could not get services for tgt `%s`: %s', tgtId, e.message)
      log.debug(e.stack)
      return []
    }
  }
  return getServices
}

'use strict'

const tables = require('../tableNames')

const sql =
`
insert into ${tables.tracking} (tgt_tid, st_tid) values ($1, $2)
`

module.exports.name = 'trackServiceLogin'
module.exports.method = function (pool, log, Promise) {
  function * trackServiceLogin (st, tgt) {
    log.trace('adding track for (st, tgt): (%s, %s)', st.tid, tgt.tid)
    try {
      yield pool.query(sql, [tgt.tid, st.tid])
      log.trace('track record added for (st, tgt): (%s, %s)', st.tid, tgt.tid)
      return Promise.resolve()
    } catch (e) {
      log.error('could not track (%s, %s): %s', st.tid, tgt.tid, e.message)
      log.debug(e.stack)
      return Promise.reject(e)
    }
  }
  return Promise.coroutine(trackServiceLogin)
}

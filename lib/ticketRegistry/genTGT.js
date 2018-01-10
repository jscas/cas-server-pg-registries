'use strict'

const joda = require('js-joda')
const uuid = require('uuid')
const tables = require('../tableNames')

const sql =
`
insert into ${tables.tgt} (tid, expires, userid) values ($1, $2, $3)
returning created, expires, valid
`

module.exports.name = 'genTGT'
module.exports.method = function (pool, log) {
  async function genTGT (userId, expires) {
    const _expires = expires || joda.convert(joda.ZonedDateTime.now().plusMinutes(30)).toDate()
    log.trace('generating tgt for %s to expire at %s', userId, _expires)
    try {
      const tid = `TGT-${uuid.v4()}`
      const result = await pool.query(sql, [tid, _expires, userId])
      log.trace('created tgt for `%s`: %s', userId, tid)
      return {
        tid: tid,
        created: result.rows[0].created,
        expires: result.rows[0].expires,
        valid: result.rows[0].valid,
        userId: userId,
        services: []
      }
    } catch (e) {
      log.error('could not generate tgt for `%s`: %s', userId, e.message)
      log.debug(e.stack)
      throw e
    }
  }
  return genTGT
}

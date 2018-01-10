'use strict'

const joda = require('js-joda')
const uuid = require('uuid')
const tables = require('../tableNames')

const getTgtSql =
`
select * from ${tables.tgt} where tid = $1
`

const updateTgtSql =
`
update ${tables.tgt} set valid = false where tid = $1
`

const insertStSql =
`
insert into ${tables.st} (tid, tgt_id, expires, service_id)
  values ($1, $2, $3, (select id from services where name = $4))
  returning created, expires, valid
`

const trackStSql =
`
insert into ${tables.tracking} (tgt_tid, st_tid) values ($1, $2)
`

module.exports.name = 'genST'
module.exports.method = function (pool, log) {
  async function validateTGT (tgtId) {
    log.trace('validating tgt: %s', tgtId)
    try {
      const result = await pool.query(getTgtSql, [tgtId])
      if (result.rows.length === 0) {
        log.trace('no ticket exists for tid: %s', tgtId)
        throw new Error('invalid ticket id')
      }
      const row = result.rows[0]
      if (!row.valid) {
        log.trace('ticket marked as invalid: %s', tgtId)
        throw new Error('requested ticket is invalid')
      }
      if (row.expires.getTime() < Date.now()) {
        log.trace('ticket has expired')
        await pool.query(updateTgtSql, [tgtId])
        throw new Error('requested ticket has expired')
      }
      return true
    } catch (e) {
      log.trace('validation failed for tgt `%s`: %s', tgtId, e.message)
      log.debug(e.stack)
      throw e
    }
  }

  async function trackService (tgtId, stId) {
    log.trace('creating service tracking record: (%s, %s)', tgtId, stId)
    try {
      await pool.query(trackStSql, [tgtId, stId])
      return true
    } catch (e) {
      // We swallow the error and simply ignore SLO for the failed
      // service.
      log.trace('could not create tracking record: %s', e.message)
      log.debug(e.stack)
      return true
    }
  }

  async function genST (tgtId, serviceId, expires) {
    try {
      await validateTGT(tgtId)
      const _expires = expires || joda.convert(joda.ZonedDateTime.now().plusMinutes(30)).toDate()
      const stId = `ST-${uuid.v4()}`
      const result = await pool.query(insertStSql, [stId, tgtId, _expires, serviceId])
      log.trace('created service ticket: %s', stId)
      await trackService(tgtId, stId)
      return {
        tid: stId,
        created: result.rows[0].created,
        expires: result.rows[0].expires,
        valid: result.rows[0].valid,
        tgtId: tgtId,
        serviceId: serviceId
      }
    } catch (e) {
      log.trace('could not generate service ticket for tgt `%s`: %s', tgtId, e.message)
      log.debug(e.stack)
      throw e
    }
  }
  return genST
}

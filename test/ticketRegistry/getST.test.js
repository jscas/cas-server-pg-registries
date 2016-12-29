'use strict'

const test = require('tap').test
const log = require('pino')({level: 'silent'})
const Promise = require('bluebird')
require('bluebird-co')

const trPath = require.resolve('../../lib/ticketRegistry')

test('#getST returns error for none found', (t) => {
  t.plan(1)
  const pool = {
    query () { return {rows: []} }
  }
  const tr = require(trPath)(pool, log, Promise)
  tr.getST(1)
    .then(() => t.fail('should not happen'))
    .catch((err) => t.is(err.message, 'could not find service ticket'))
})

test('#getST returns st when found', (t) => {
  t.plan(6)
  const created = new Date()
  const expires = new Date(Date.now() + 300)
  const pool = {
    query () {
      return {
        rows: [{
          tid: 1,
          serviceId: 1,
          tgtId: 1,
          created: created,
          expires: expires,
          valid: true
        }]
      }
    }
  }
  const tr = require(trPath)(pool, log, Promise)
  tr.getST(1)
    .then((st) => {
      t.is(st.tid, 1)
      t.is(st.serviceId, 1)
      t.is(st.tgtId, 1)
      t.is(st.created, created)
      t.is(st.expires, expires)
      t.is(st.valid, true)
    })
    .catch((err) => t.threw(err))
})

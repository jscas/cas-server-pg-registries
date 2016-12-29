'use strict'

const test = require('tap').test
const log = require('pino')({level: 'silent'})
const Promise = require('bluebird')
require('bluebird-co')

const trPath = require.resolve('../../lib/ticketRegistry')

test('#invalidateST return error on exception', (t) => {
  t.plan(1)
  const pool = {
    query () { throw new Error('failed') }
  }
  const tr = require(trPath)(pool, log, Promise)
  tr.invalidateST(1)
    .then(() => t.fail('should not happen'))
    .catch((err) => t.is(err.message, 'failed'))
})

test('#invalidateST returns st on success', (t) => {
  t.plan(6)
  const created = new Date()
  const expires = new Date(Date.now() + 300)
  const pool = {
    query () {
      return {
        rows: [{
          tid: 1,
          created: created,
          expires: expires,
          valid: false,
          tgtId: 1,
          serviceId: 1
        }]
      }
    }
  }
  const tr = require(trPath)(pool, log, Promise)
  tr.invalidateST(1)
    .then((st) => {
      t.is(st.tid, 1)
      t.is(st.created, created)
      t.is(st.expires, expires)
      t.is(st.valid, false)
      t.is(st.tgtId, 1)
      t.is(st.serviceId, 1)
    })
    .catch((err) => t.threw(err))
})

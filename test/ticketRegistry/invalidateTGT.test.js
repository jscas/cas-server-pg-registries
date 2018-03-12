'use strict'

const test = require('tap').test
const log = require('../nullLogger')

const trPath = require.resolve('../../lib/ticketRegistry')

test('#invalidateTGT return error on exception', (t) => {
  t.plan(1)
  const pool = {
    query () { throw new Error('failed') }
  }
  const tr = require(trPath)(pool, log)
  tr.invalidateTGT(1)
    .then(() => t.fail('should not happen'))
    .catch((err) => t.is(err.message, 'failed'))
})

test('#invalidateTGT returns tgt on success', (t) => {
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
  const tr = require(trPath)(pool, log)
  tr.invalidateTGT(1)
    .then((tgt) => {
      t.is(tgt.tid, 1)
      t.is(tgt.created, created)
      t.is(tgt.expires, expires)
      t.is(tgt.valid, false)
      t.type(tgt.services, Array)
      t.is(tgt.services.length, 1)
    })
    .catch((err) => t.threw(err))
})

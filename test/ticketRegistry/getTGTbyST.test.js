'use strict'

const test = require('tap').test
const log = require('../nullLogger')

const trPath = require.resolve('../../lib/ticketRegistry')

test('#getTGTbyST returns error for none found', (t) => {
  t.plan(1)
  const pool = {
    query () { return {rows: []} }
  }
  const tr = require(trPath)(pool, log)
  tr.getTGTbyST(1)
    .then(() => t.fail('should not happen'))
    .catch((err) => t.is(err.message, 'ticket granting ticket missing for service ticket'))
})

test('#getTGTbyST returns tgt on success', (t) => {
  t.plan(5)
  const created = new Date()
  const expires = new Date(Date.now() + 300)
  const pool = {
    query () {
      return {
        rows: [{
          tid: 1,
          userId: 'foo',
          created: created,
          expires: expires,
          valid: true
        }]
      }
    }
  }
  const tr = require(trPath)(pool, log)
  tr.getTGTbyST(1)
    .then((tgt) => {
      t.is(tgt.tid, 1)
      t.is(tgt.userId, 'foo')
      t.is(tgt.created, created)
      t.is(tgt.expires, expires)
      t.is(tgt.valid, true)
    })
    .catch((err) => t.threw(err))
})

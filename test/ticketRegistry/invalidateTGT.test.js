'use strict'

const test = require('tap').test
const log = require('pino')({level: 'silent'})
const Promise = require('bluebird')
require('bluebird-co')

const trPath = require.resolve('../../lib/ticketRegistry')

test('#invalidateTGT return error on exception', (t) => {
  t.plan(1)
  const pool = {
    query () { throw new Error('failed') }
  }
  const tr = require(trPath)(pool, log, Promise)
  tr.invalidateTGT(1)
    .then(() => t.fail('should not happen'))
    .catch((err) => t.is(err.message, 'failed'))
})

test('#invalidateTGT returns st on success', (t) => {
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
          userId: 'foo',
          services: []
        }]
      }
    }
  }
  const tr = require(trPath)(pool, log, Promise)
  tr.invalidateTGT(1)
    .then((tgt) => {
      t.is(tgt.tid, 1)
      t.is(tgt.created, created)
      t.is(tgt.expires, expires)
      t.is(tgt.valid, false)
      t.is(tgt.userId, 'foo')
      t.deepEqual(tgt.services, [])
    })
    .catch((err) => t.threw(err))
})

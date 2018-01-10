'use strict'

const test = require('tap').test
const log = require('../nullLogger')

const trPath = require.resolve('../../lib/ticketRegistry')

test('#getSTbyTGT empty array when none found', (t) => {
  t.plan(2)
  const pool = {
    query () { return {rows: []} }
  }
  const tr = require(trPath)(pool, log)
  tr.getSTbyTGT(1)
    .then((sts) => {
      t.is(Array.isArray(sts), true)
      t.is(sts.length, 0)
    })
    .catch((err) => t.threw(err))
})

test('#getSTbyTGT returns error on exception', (t) => {
  t.plan(1)
  const pool = {
    query () { throw new Error('failed') }
  }
  const tr = require(trPath)(pool, log)
  tr.getSTbyTGT(1)
    .then(() => t.fail('should not happen'))
    .catch((err) => t.is(err.message, 'failed'))
})

test('#getSTbyTGT return tickets on success', (t) => {
  t.plan(8)
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
  const tr = require(trPath)(pool, log)
  tr.getSTbyTGT(1)
    .then((sts) => {
      t.is(Array.isArray(sts), true)
      t.is(sts.length, 1)
      t.is(sts[0].tid, 1)
      t.is(sts[0].serviceId, 1)
      t.is(sts[0].tgtId, 1)
      t.is(sts[0].created, created)
      t.is(sts[0].expires, expires)
      t.is(sts[0].valid, true)
    })
    .catch((err) => t.threw(err))
})

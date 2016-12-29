'use strict'

const test = require('tap').test
const log = require('pino')({level: 'silent'})
const Promise = require('bluebird')
require('bluebird-co')

const trPath = require.resolve('../../lib/ticketRegistry')

test('#genTGT fails if query throws', (t) => {
  t.plan(1)
  const pool = {
    query () { throw new Error('failed') }
  }
  const tr = require(trPath)(pool, log, Promise)
  tr.genTGT('foo', new Date())
    .then(() => t.fail('should not happen'))
    .catch((err) => t.is(err.message, 'failed'))
})

test('#genTGT succeeds', (t) => {
  t.plan(6)
  const pool = {
    query (str, params) {
      return {
        rows: [{
          created: new Date(),
          expires: params[1],
          valid: true
        }]
      }
    }
  }
  const tr = require(trPath)(pool, log, Promise)
  tr.genTGT('foo', null)
    .then((tgt) => {
      t.is(tgt.tid.startsWith('TGT-'), true)
      t.is(tgt.created < new Date(Date.now() + 300), true)
      t.is(tgt.expires > new Date(), true)
      t.is(tgt.valid, true)
      t.is(tgt.userId, 'foo')
      t.is(tgt.services.length, 0)
    })
    .catch((err) => t.threw(err))
})

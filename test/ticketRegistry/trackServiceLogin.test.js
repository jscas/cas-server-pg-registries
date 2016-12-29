'use strict'

const test = require('tap').test
const log = require('pino')({level: 'silent'})
const Promise = require('bluebird')
require('bluebird-co')

const trPath = require.resolve('../../lib/ticketRegistry')

test('#trackServiceLogin rejects on exception', (t) => {
  t.plan(1)
  const pool = {
    query () { throw new Error('failed') }
  }
  const tr = require(trPath)(pool, log, Promise)
  tr.trackServiceLogin({}, {}, 'example.com')
    .then(() => t.fail('should not happen'))
    .catch((err) => t.is(err.message, 'failed'))
})

test('#trackServiceLogin resolve on success', (t) => {
  t.plan(1)
  const pool = {
    query () { return {rows: []} }
  }
  const tr = require(trPath)(pool, log, Promise)
  tr.trackServiceLogin({tid: 1}, {tid: 1}, 'example.com')
    .then(() => t.pass('success'))
    .catch((err) => t.threw(err))
})

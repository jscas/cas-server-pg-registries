'use strict'

const test = require('tap').test
const log = require('../nullLogger')

const path = require.resolve('../../lib/ticketRegistry/getServices')

test('returns empty array on error', (t) => {
  t.plan(2)
  const pool = {
    query () { throw new Error('failed') }
  }
  const getServices = require(path)(pool, log)
  getServices(1)
    .then((services) => {
      t.is(Array.isArray(services), true)
      t.is(services.length, 0)
    })
    .catch((err) => t.threw(err))
})

test('returns empty array for none found', (t) => {
  t.plan(2)
  const pool = {
    query () { return [] }
  }
  const getServices = require(path)(pool, log)
  getServices(1)
    .then((services) => {
      t.is(Array.isArray(services), true)
      t.is(services.length, 0)
    })
    .catch((err) => t.threw(err))
})

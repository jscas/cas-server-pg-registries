'use strict'

const test = require('tap').test
const log = require('../nullLogger')

const tables = require('../../lib/tableNames')
const trPath = require.resolve('../../lib/ticketRegistry')

test('#genST fails if no tgt found', (t) => {
  t.plan(1)
  const pool = {
    query (str) {
      if (str.indexOf(`select * from ${tables.tgt}`) > -1) {
        return {rows: []}
      }
    }
  }
  const tr = require(trPath)(pool, log)
  tr.genST(1, 1, new Date())
    .then(() => t.fail('should not happen'))
    .catch((err) => t.is(err.message, 'invalid ticket id'))
})

test('#genST fails tgt marked invalid', (t) => {
  t.plan(1)
  const pool = {
    query (str) {
      if (str.indexOf(`select * from ${tables.tgt}`) > -1) {
        return {rows: [{valid: false}]}
      }
    }
  }
  const tr = require(trPath)(pool, log)
  tr.genST(1, 1, new Date())
    .then(() => t.fail('should not happen'))
    .catch((err) => t.is(err.message, 'requested ticket is invalid'))
})

test('#genST fails if tgt expired', (t) => {
  t.plan(1)
  const pool = {
    query (str) {
      if (str.indexOf(`select * from ${tables.tgt}`) > -1) {
        return {rows: [{expires: new Date(0), valid: true}]}
      }
      return {}
    }
  }
  const tr = require(trPath)(pool, log)
  tr.genST(1, 1, new Date())
    .then(() => t.fail('should not happen'))
    .catch((err) => t.is(err.message, 'requested ticket has expired'))
})

test('#genST succeeds', (t) => {
  t.plan(6)
  const pool = {
    query (str, params) {
      if (str.indexOf(`select * from ${tables.tgt}`) > -1) {
        return {rows: [{expires: new Date(Date.now() + 30000), valid: true}]}
      }
      if (str.indexOf(`insert into ${tables.st}`) > -1) {
        return {
          rows: [{
            created: new Date(),
            expires: params[2],
            valid: true
          }]
        }
      }
      return {}
    }
  }
  const tr = require(trPath)(pool, log)
  tr.genST(1, 1)
    .then((st) => {
      t.is(st.tid.startsWith('ST-'), true)
      t.is(st.created < new Date(Date.now() + 300), true)
      t.is(st.expires > new Date(), true)
      t.is(st.valid, true)
      t.is(st.tgtId, 1)
      t.is(st.serviceId, 1)
    })
    .catch((err) => t.threw(err))
})

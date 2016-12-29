'use strict'

const test = require('tap').test
const log = require('pino')({level: 'silent'})
const Promise = require('bluebird')

test('#close succeeds', (t) => {
  t.plan(1)
  const tr = require('../../lib/ticketRegistry')({}, log, Promise)
  tr.close()
    .then(() => t.pass())
    .catch((err) => t.threw(err))
})

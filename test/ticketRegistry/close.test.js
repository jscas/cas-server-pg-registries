'use strict'

const test = require('tap').test
const log = require('../nullLogger')

test('#close succeeds', (t) => {
  t.plan(1)
  const tr = require('../../lib/ticketRegistry')({}, log)
  tr.close()
    .then(() => t.pass())
    .catch((err) => t.threw(err))
})

'use strict'

const test = require('tap').test
const log = require('./nullLogger')

const srPath = require.resolve('../lib/serviceRegistry')

test('#getServiceWithName should error when 0 found', (t) => {
  t.plan(1)
  const pool = {
    query () {
      return {rows: []}
    }
  }
  const sr = require(srPath)(pool, log)
  sr.getServiceWithName('foo')
    .then(() => t.fail('should not happen'))
    .catch((err) => t.is(err.message, 'no service found'))
})

test('#getServiceWithName should fail when query throws', (t) => {
  t.plan(1)
  const pool = {
    query () { throw new Error('failed') }
  }
  const sr = require(srPath)(pool, log)
  sr.getServiceWithName('foo')
    .then(() => t.fail('should not happen'))
    .catch((err) => t.is(err.message, 'failed'))
})

test('#getServiceWithName should succeed for found service', (t) => {
  t.plan(4)
  const pool = {
    query () {
      return {
        rows: [{
          id: 1,
          name: 'foo',
          comment: 'bar',
          url: 'example.com'
        }]
      }
    }
  }
  const sr = require(srPath)(pool, log)
  sr.getServiceWithName('foo')
    .then((service) => {
      t.is(service.id, 1)
      t.is(service.name, 'foo')
      t.is(service.comment, 'bar')
      t.is(service.url, 'example.com')
    })
    .catch((err) => t.threw(err))
})

test('#getServiceWithUrl should error when 0 found', (t) => {
  t.plan(1)
  const pool = {
    query () {
      return {rows: []}
    }
  }
  const sr = require(srPath)(pool, log)
  sr.getServiceWithUrl('example.com')
    .then(() => t.fail('should not happen'))
    .catch((err) => t.is(err.message, 'unknown service: example.com'))
})

test('#getServiceWithUrl should fail when query throws', (t) => {
  t.plan(1)
  const pool = {
    query () { throw new Error('failed') }
  }
  const sr = require(srPath)(pool, log)
  sr.getServiceWithUrl('example.com')
    .then(() => t.fail('should not happen'))
    .catch((err) => t.is(err.message, 'failed'))
})

test('#getServiceWithUrl should succeed for found service', (t) => {
  t.plan(4)
  const pool = {
    query () {
      return {
        rows: [{
          id: 1,
          name: 'foo',
          comment: 'bar',
          url: 'example.com'
        }]
      }
    }
  }
  const sr = require(srPath)(pool, log)
  sr.getServiceWithUrl('example.com')
    .then((service) => {
      t.is(service.id, 1)
      t.is(service.name, 'foo')
      t.is(service.comment, 'bar')
      t.is(service.url, 'example.com')
    })
    .catch((err) => t.threw(err))
})

test('#close succeeds', (t) => {
  t.plan(1)
  const sr = require(srPath)({}, log)
  sr.close()
    .then(() => t.pass())
    .catch((err) => t.threw(err))
})

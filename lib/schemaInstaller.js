'use strict'

const questions = []
questions.push({
  name: 'username',
  message: 'db username: ',
  validate (value) {
    if (!value) return 'a username is required'
    return true
  }
})
questions.push({
  name: 'password',
  message: 'db password: ',
  type: 'password',
  validate (value) {
    if (!value) return `enter 'peer' for peer authentication`
    return true
  }
})
questions.push({
  name: 'dbHost',
  message: 'db host: ',
  'default': 'localhost'
})
questions.push({
  name: 'dbPort',
  message: 'dp port: ',
  'default': 5432
})
questions.push({
  name: 'dbName',
  message: 'db name: ',
  'default': 'jscas'
})

const initdb = (answers) => {
  const path = require('path')
  const pg = require('pg')
  const config = {
    user: answers.username,
    database: answers.dbName,
    host: answers.dbHost,
    port: answers.dbPort
  }
  if (answers.password !== 'peer') config.password = answers.password
  const client = new pg.Client(config)
  client.connect()
  const cloob = require('cloob')({query: client.query.bind(client)})
  cloob.loadMigrations(path.join(__dirname, '..', 'migrations'), (err, migrations) => {
    if (err) {
      console.error('could not load migration files: %s', err.message)
      client.end()
      return
    }
    cloob.migrateUp(migrations)
      .then((applied) => {
        console.log('applied migrations: %j', migrations)
      })
      .catch((err) => {
        console.error('failed: %s', err.message)
        console.error(err.stack)
      })
      .then(() => client.end())
  })
}

const env = process.env
if (env['DB_USERNAME'] && env['DB_NAME'] && env['DB_HOST'] && env['DB_PORT']) {
  initdb({
    username: env['DB_USERNAME'],
    database: env['DB_NAME'],
    host: env['DB_HOST'],
    port: env['DB_PORT'],
    password: env['DB_PASSWORD'] || 'peer'
  })
} else {
  const inquirer = require('inquirer')
  inquirer.prompt(questions).then(initdb).catch(console.error)
}

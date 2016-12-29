# pg-registries

This plugin provides service and ticket registries for [JSCAS][jscas]. These
registries are backed by a [PostgreSQL][psql] database.

[jscas]: https://github.com/jscas/cas-server
[psql]: https://www.postgresql.org/

## Requirements

+ Expects [Bluebird][bluebird] to be the Promise object in the context
+ Expects [Bluebird-co][bbco] handlers to be added to the Promise object
+ [cas-server][cas-server] >= 0.11.0

[bluebird]: https://www.npmjs.com/package/bluebird
[bbco]: https://www.npmjs.com/package/bluebird-co
[cas-server]: https://github.com/jscas/cas-server

## Install

First, create a database and database user if you have not already:

```
$ sudo -u postgres psql
postgres=# create database jscas;
postgres=# create user jscas with password 'super-secret';
postgres=# grant all privileges on database jscas to jscas;
postgres=# \q
```

Second, run the schema installer included with this module:

```
$ ./node_modules/.bin/pg-registries-install-schema
```

The schema installer will prompt you for connection details to your database.
Other than the username and password, some defaults will be provided that you
can simply accept (press "enter") if they match your environment.

**Note:** if you have installed this module in a directory other than your
`cas-server` install directory then you will need to explicitly install the
`pg` module: `npm install pg`. This module's schema installer requires a direct
dependency on it. The regular operation of the module will use the one provided
by `cas-server`.

Finally, you can start adding services to your database:

```
$ uuidgen
69B38CEA-6EAB-42CE-B254-81114DE6733D
$ psql -U jscas -h localhost jscas
jscas=> insert into services (id, name, url, comment) values (
  '69B38CEA-6EAB-42CE-B254-81114DE6733D',
  'foo-service',
  'https://app.example.com/cas-callback-endpoint',
  'a simple service that authenticates via cas'
);
jscas=> \q
```

## Configuration

Edit your `cas-server` settings file to:

1. Include a `postgres` data source configuration for your database.
2. Specify the service registry: `serviceRegistry: require('cas-server-pg-registries').serviceRegistry`
3. Specify the ticket registry: `ticketRegistry: require('cas-server-pg-registries').ticketRegistry`

## Services

A service record has the following properties (columns):

+ `id` {uuid}: must be specified when creating a new record. It's up to you
  to generate the UUID. If your server supports it, you can use the
  [uuid-ossp][uuid-ossp] functions.
+ `name` {text}: must be specified when creating a new record. This is used to
  provide a user friendly identifier for the service.
+ `url` {text}: the URL associated with this service. The URL is explictly
  matched when `cas-server` is validating service authentication requests.
+ `comment` {text}: a user friendly snippet to describe the service and its
  purpose. May be used in management interfaces.
+ `slo` {boolean}: enables, or disables, Single Logout support. If this is
  set to `true`, then `slourl` must be set. Default: `false`.
+ `slotype` {integer}: reserved for future use. This does not currently have
  any effect.
+ `slourl` {text}: must be set to the URL of the remote service that will
  process logout requests when `slo` is set to `true`.

[uuid-ossp]: https://www.postgresql.org/docs/current/static/uuid-ossp.html

## Database Maintenance

This module does not remove any data from the database. Which is to say, the
database will grow infinitely unless you regularly purge data from it. This
is done to allow you the ability to audit the information according to your
own requirements.

Here's a sample script to purge 24 hour old data:

```sh
#!/bin/bash
#
# This script assumes you have a .pgpass for the user running it.
# https://www.postgresql.org/docs/current/static/libpq-pgpass.html

psql -U jscas -h localhost jscas <<EOF
delete from tgt_service_tracking where created < (now() - interval '24 hours');
delete from service_tickets where created < (now() - interval '24 hours');
delete from ticket_granting_tickets where created < (now() - interval '24 hours');
EOF
```

## License

[MIT License](http://jsumners.mit-license.org/)

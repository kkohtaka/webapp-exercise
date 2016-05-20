# Learn to Develop a Web Application

This is a practice for Z Lab's newbies to learn developing a web application.

## Requirements

- [Node.js & NPM](https://nodejs.org/)
- [PostgreSQL](http://www.postgresql.org/)

## Requirements for Development

- [gulp](http://gulpjs.com/)

Install the NPM packages by executing the following commands.

```bash
$> npm install --global gulp-cli
```

- [Docker](https://www.docker.com/)

Use Docker to host PostgreSQL server locally.

```bash
$> docker pull orchardup/postgresql
$> docker run --rm -p 5432:5432 -e POSTGRESQL_DB=development orchardup/postgresql
$> docker run --rm -p 5433:5432 -e POSTGRESQL_DB=test orchardup/postgresql
```

## License

Closed

## Copyright

Copyright 2016, Z Lab Corporation. All rights reserved.

# Web Application Exercise

[![Build Status](https://travis-ci.org/kkohtaka/webapp-exercise.svg?branch=master)](https://travis-ci.org/kkohtaka/webapp-exercise)

This is an exercise for Z Lab's newbies to learn developing a web application.

## Requirements to Run the Application

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
$> docker pull postgres
$> docker run --rm -p 5433:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD= -e POSTGRES_DB=development postgres
$> docker run --rm -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD= -e POSTGRES_DB=test postgres
```

## License

Closed

## Copyright

Copyright 2016, Z Lab Corporation. All rights reserved.

## Description

A base project written around the [Nest](https://github.com/nestjs/nest) Framework.
This is a base project written with NestJS to accelerate project setup and creation, it comes pre-backed with the latest NestJS Libraries / runs with NestJS CLI. Implement User Authorization and Authentication through a Postgres Database and JWT Tokens. Supporting short term tokens and long term Refresh Tokens.

## Current Features

- JWT Authorization
- Ability to Refresh short lived JWT tokens
- Ability to create a new User
- Ability to login as a User
- Per environment configuration

## Installation

```bash
$ npm install
```

## Environment

You will need to create an enironment file to get started.
A config file is loaded based on the exported NODE_ENV, for instance
if you set your NODE_ENV to `dev` and run this server,
it will look for the config file `.env.dev`

Start Scripts map to these env files.
`npm run start:dev` -> `.env.dev`
`npm run start:debug` -> `.env.debug`
`npm run start:prod` -> `.env.production`

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

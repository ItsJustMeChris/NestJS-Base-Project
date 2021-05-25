## Description

A base project written around the [Nest](https://github.com/nestjs/nest) Framework.
This is a base project written with NestJS to accelerate project setup and creation, it comes pre-backed with the latest NestJS Libraries / runs with NestJS CLI. Implement User Authorization and Authentication through a Postgres Database and JWT Tokens. Supporting short term tokens and long term Refresh Tokens.

## Current Features

- JWT Authorization
- Ability to Refresh short lived JWT tokens
- Ability to create a new User
- Ability to login as a User
- Per environment configuration
- 2FA Through Authenticators

## Installation

```bash
$ npm install
```

## 2FA Notes

Recommend using [OTPLib](https://www.npmjs.com/package/otplib) to generate secrets on the client side.

## Environment

!! IMPORTANT JWT SECRET NOTES !!
===

You should use unique JWT secret keys for each type of secret, if you don't then you will be unintentionally authenticating users unintentionally with 2FA tokens or granting long term access tokens unintentionally through renew tokens. 

===

You do `NOT` need to use `.env` 'configuration' files, if you wish to manually `export` variables for example, with a systemd service, there will be no need to create an environment file. If you wish to do this, there's a provided sample systemd service file.

The current required environment variables are found inside `.env.example`

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

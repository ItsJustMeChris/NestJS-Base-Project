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
- HTTP2 Support
- HTTPS Support
- Database Migrations

## In Progress Features

- JWT Revocation
- Permissions management

## Installation

```bash
$ npm install
```

## 2FA Notes

Recommend using [OTPLib](https://www.npmjs.com/package/otplib) to generate secrets on the client side.
Otherwise, see the [Secret-Requirements](https://www.npmjs.com/package/otplib#difference-between-authenticator-and-totp)

## Using Permissions

Permissions are Bit Packed integers ranging from 0 to 1111, there's a helper enum `PERMISSION` containing the following.

```ts
export enum PERMISSION {
  NONE = 0,

  CREATE = 1,
  READ = 10,
  UPDATE = 100,
  DELETE = 1000,

  ANY = 1111,
}
```

Here's an example of using permissions to Guard the create route with the CREATE permission level.

As we see in this example, the user must have permission to:

- Create authenticators

```ts
  // Include the PermissionGuard as a decorator for a controller route.
  @UseGuards(PermissionsGuard)
  // Supply a single permission with a model and the allowances required for the route.
  @Permissions({
    model: 'authenticators',
    allowances: PERMISSION.CREATE,
  })
  @Post('create')
  async create() {}
```

You can guard routes with multiple permissions, for example if we wanted to allow some admins to be able to manage a Users Authenticators, we'd want to make sure they can Update Users and Create Authenticators

As we see in this example, the user must have permission to:

- Create authenticators
- Update users

```ts
  // Include the PermissionGuard as a decorator for a controller route.
  @UseGuards(PermissionsGuard)
  // Supply multiple permissions with a model and the allowances to be AND'd together and required for the route.
  @Permissions({
    model: 'authenticators',
    allowances: PERMISSION.CREATE,
  },
  {
    model: 'users',
    allowances: PERMISSION.UPDATE,
  })
  @Post('create')
  async create() {}
```

Alternatively if we wish to guard a route and allow variable permissions, but not require them all, we can pass the permissions as an array.

As we see in this example, the user must have permission to:

- Create authenticators OR Update users

```ts
  // Include the PermissionGuard as a decorator for a controller route.
  @UseGuards(PermissionsGuard)
  // Supply multiple permissions with a model and the allowances to be OR'd together and required for the route.
  @Permissions([
      {
        model: 'authenticators',
        allowances: PERMISSION.CREATE,
      },
      {
        model: 'users',
        allowances: PERMISSION.UPDATE,
      }
  ])
  @Post('create')
  async create() {}
```

And lastly if we wish to validate that a route had any of a group of permissions, AND any other permissions, we just add them to the decorator as full objects, as we did in the first examples.

As we see in this example, the user must have permission to:

- Create authenticators OR Update users
- UPDATE management
- READ administrative

```ts
  // Include the PermissionGuard as a decorator for a controller route.
  @UseGuards(PermissionsGuard)
  // Supply multiple permissions with a model and the allowances to be OR'd together and a set of permissions that're AND'd with those, to be required for the route.
  @Permissions([
      {
        model: 'authenticators',
        allowances: PERMISSION.CREATE,
      },
      {
        model: 'users',
        allowances: PERMISSION.UPDATE,
      }
  ],
  {
    model: 'management',
    allowances: PERMISSION.UPDATE,
  },
  {
    model: 'administrative',
    allowances: PERMISSION.READ,
  })
  @Post('create')
  async create() {}
```

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

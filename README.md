# Authentication

[![npm version](https://badge.fury.io/js/@universal-packages%2Fauthentication.svg)](https://www.npmjs.com/package/@universal-packages/authentication)
[![Testing](https://github.com/universal-packages/universal-authentication/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-authentication/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-authentication/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-authentication)

Dynamic authentication api base to bu plugged in with dynamic api modules to shape any custom authentication system. It comes with a default modules to handle a very simp,e email password authentication system, but it can be extended or replaced for a more sophisticated one.

## Install

```shell
npm install @universal-packages/authentication
```

## Authentication

The `Authentication` class is a descendant of `DynamicApi` class, it is the entry interface to load and perform all our authentication related dynamics.

```js
import { Authentication } from '@universal-packages/authentication'

const authentication = new Authentication({ dynamicsLocation: './src', secret: 'my secret' })

await authentication.loadDynamics()

const result = await authentication.performDynamic('log-in', { email: 'david@universal-packages.com', password: '12345678' })

console.log(result)

// > { status: 'success', authenticatable: { id: 69, username: 'username', createdAt: [Date] } }
```

To override override parts of the default system just create non default dynamics in your dynamics location with the extension prefix `auth-dynamic`, ex: `LogIn.auth-dynamic.js` and export ad default dynamic class there. More about all the dynamics that can be override below.

### Options

Authentication take options similar to [DynamicApi options](https://github.com/universal-packages/universal-dynamic-api#options):

- **`debug`** `Boolean`
  If true the instance of this authentication dynamic api will keep track of what is being performed into a log.

- **`dynamicsLocation`** `Required` `String`
  Where to look up for dynamics to load withe to override default ones or new ones.

- **`secret`** `Required` `String`
  Secret used for cryptography to generate tokens and verifying them for this authentication instance in particular.

- **`modules`** `Map`
  Authentication api modules to be enabled and configured

- **`oneTimePassword`** `OneTimePasswordOptions`
  Options to configure how one time passwords are generated and validated. Check [The options here](https://github.com/universal-packages/universal-time-based-one-time-password?tab=readme-ov-file#options)

- **`defaultModule`** `DynamicApiModule`
  - **`enabled`** `Boolean`
    Whether the module is enabled or not.
  - **`options`** `Object`
    - **`emailValidation`** `Object`
      - **`matcher`** `Regexp`
        Custom matcher to validate email.
      - **`size`** `Object`
        - **`min`** `Number`
          Minimum size of the email.
        - **`max`** `Number`
          Maximum size of the email.
    - **`passwordValidation`** `Object`
      - **`size`** `Object`
        - **`min`** `Number`
          Minimum size of the password.
        - **`max`** `Number`
          Maximum size of the password.

## Authenticatable

Internally this auth system will handle an abstract `Authenticatable` class, we need to provided it in order for the whole thing to work.

```js
import User from './User'

authentication.setAuthenticatableClass(User)
```

```js
import { Encrypt } from '@universal-packages/authentication'

export default class User {
  id

  email

  @Encrypt()
  password
  encryptedPassword

  save() {}

  static async existsWithEmail(email) {}
  static async fromId(id) {}
  static async fromEmail(email) {}
}
```

## Decorators

#### **`Encrypt([propertyToEncrypt: string])`**

Use this decorator to automatically encrypt attributes in a class. For example for the `password` attribute, when decorated, every time is set, the `encryptedPassword` attribute is going to set with a hashed and salted string based on the password. It sets depending on the base attribute name `encrypted<Attribute>`.

```js
import { Encrypt } from '@universal-packages/authentication'

export default class User {
  @Encrypt()
  secret
  encryptedSecret
}

const user = new User()

user.secret = 'my password'

console.log(user.secret, user.encryptedSecret)

// > undefined C49HSl4okw8yoCKfoNRnsqD4T0T6SJZkdpTgU1o478Mk4GT995KV5HUKzvsnN1fShOo9sdDQq3Rjiz+Brj9bCIeJfWrt7tMl936wWyBARkPCdDlj9OfLNNDnhGo7dkmbU8YBfpgcmoMUmCuIftupOik+Nk/Eu83J4epW5y2w0fM=
```

You can also specify the attribute name to store the hashed password.

```js
import { Encrypt } from '@universal-packages/authentication'

export default class User {
  @Encrypt('hashedSecret')
  secret
  hashedSecret
}
```

## Default module dynamics

### log-in `Async`

Verifies email and password and if all configured behavior is positive it returns the authenticatable for which the credentials matched.

```js
const result = authentication.perform('log-in', { email: 'david@universal-packages.com', password: 'password' })
```

- **`PAYLOAD`** `Object`
  - **`email`** `String`
  - **`password`** `String`
- **`RESULT`** `AuthenticationResult`
  - **`authenticatable`** `Authenticatable`
  - **`message?`**
    - `invalid-credentials` `failure`

### request-password-reset `Async`

Generates a password reset and performs the `send-password-reset` dynamic passing the one time password.

```js
const result = authentication.perform('request-password-reset', { email: 'david@u-p.com' })
```

- **`PAYLOAD`** `Object`
  - **`email`** `String`
- **`RESULT`** `AuthenticationResult`
  - **`message?`**
    - `nothing-to-do` `warning``

### sign-up `Async`

Validates sign up attributes and creates the new authenticatable.

```js
const result = authentication.perform('sign-up', { email: 'some email', password: 'some password' })
```

- **`PAYLOAD`** `Object`
  - **`email`** `String`
  - **`password`** `String`
- **`RESULT`** `AuthenticationResult`
  - **`authenticatable`** `Authenticatable`
  - **`validation`** `ValidationResult` `failure`
    - **`valid`** `Boolean`
    - **`errors`** `Object`
      - **`<attribute>`** `String[]`

### update-email-password `Async`

Validates and updates an authenticatable with new email and or password.

```js
const result = authentication.perform('update-email-password', { email: 'new-email', authenticatable })
```

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
  - **`email`** `String`
  - **`password`** `String`
- **`RESULT`** `AuthenticationResult`
  - **`authenticatable`** `Authenticatable`
  - **`validation`** `ValidationResult` `failure`
    - **`valid`** `Boolean`
    - **`errors`** `Object`
      - **`<attribute>`** `String[]`

### verify-password-reset `Async`

Verifies a password reset and sets a new password

```js
const result = authentication.perform('verify-password-reset', { email: 'email@email.com', oneTimePassword: '123456', password: 'new password' })
```

- **`PAYLOAD`** `Object`
  - **`email`** `String`
  - **`oneTimePassword`** `String`
  - **`password`** `String`
- **`RESULT`** `AuthenticationResult`
  - **`validation`** `ValidationResult` `failure`
    - **`valid`** `Boolean`
    - **`errors`** `Object`
      - **`<attribute>`** `String[]`
  - **`message?`**
    - `invalid-one-time-password` `failure`

### Default module extensions
[file](src/default-module/extensions/AfterLogInFailure.universal-auth-dynamic.ts) [file](src/default-module/extensions/AfterLogInAuthenticatableNotFound.universal-auth-dynamic.ts) [file](src/default-module/extensions/AfterLogInSuccess.universal-auth-dynamic.ts) [file](src/default-module/extensions/AfterSignUpFailure.universal-auth-dynamic.ts) [file](src/default-module/extensions/AfterSignUpSuccess.universal-auth-dynamic.ts) [file](src/default-module/extensions/AfterUpdateSuccess.universal-auth-dynamic.ts) [file](src/default-module/extensions/ContinueAfterLogInAuthenticatableFound.universal-auth-dynamic.ts) [file](src/default-module/extensions/ContinueBeforeLogIn.universal-auth-dynamic.ts) [file](src/default-module/extensions/ContinueBeforeSignUp.universal-auth-dynamic.ts)

These dynamics are used to extend the default module dynamics, they are called on specific points while logging in and signing up.

#### after-log-in-authenticatable-not-found

When the authenticatable is not found while logging in. Write your custom dynamic to handle this case.

- **`PAYLOAD`** `Object`
  - **`email`** `String`
- **`RESULT`** `void`

#### after-log-in-failure

When the log in fails. Write your custom dynamic to handle this case.

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `void`

#### after-log-in-success

When the log in is successful. Write your custom dynamic to handle this case.

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `void`

#### after-sign-up-failure

When the sign up fails. Write your custom dynamic to handle this case.

- **`PAYLOAD`** `Object`
  - **`email`** `String`
  - **`password`** `String`
  - **`validation`** `ValidationResult`
- **`RESULT`** `void`

#### after-sign-up-success

When the sign up is successful. Write your custom dynamic to handle this case.

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `void`

#### after-update-success

When the update is successful. Write your custom dynamic to handle this case.

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `void`

#### continue-after-log-in-authenticatable-found

When the authenticatable is found while logging in. Write your custom dynamic to handle this case and return true if you want to continue with the default behavior.

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `Boolean`

#### continue-before-log-in

Before logging in. Write your custom dynamic to handle this case and return true if you want to continue with the default behavior.

- **`PAYLOAD`** `Object`
  - **`email`** `String`
  - **`password`** `String`
- **`RESULT`** `Boolean`

#### continue-before-sign-up

Before signing up. Write your custom dynamic to handle this case and return true if you want to continue with the default behavior.

- **`PAYLOAD`** `Object`
  - **`email`** `String`
  - **`password`** `String`

### Default module internal dynamics

Dynamics used internally by the default module dynamics that can be overridden in case your Authenticatable behaves differently as expected by the default module dynamics.

### authenticatable-from-email

- **`PAYLOAD`** `Object`
  - **`email`** `String`
- **`RESULT`** `Authenticatable`

### authenticatable-from-sign-up-attributes

- **`PAYLOAD`** `Object`
  - **`email`** `String`
  - **`password`** `String`
- **`RESULT`** `Authenticatable`

### authenticatable-exists-with-email?

- **`PAYLOAD`** `Object`
  - **`email`** `String`
- **`RESULT`** `Boolean`

### do-passwords-match?

- **`PAYLOAD`** `Object`
  - **`password`** `String`
  - **`encryptedPassword`** `String`
- **`RESULT`** `Boolean`

### get-authenticatable-encrypted-password

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `String`

### set-authenticatable-password

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
  - **`password`** `String`
- **`RESULT`** `void`

### send-password-reset

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
  - **`oneTimePassword`** `String`
- **`RESULT`** `void`

### send-password-was-reset

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `void`

### validate-password-reset

- **`PAYLOAD`** `Object`
  - **`password`** `String`
- **`RESULT`** `ValidationResult`
  - **`valid`** `Boolean`
  - **`errors`** `Object`
    - **`<attribute>`** `String[]`

### validate-sign-up

- **`PAYLOAD`** `Object`
  - **`email`** `String`
  - **`password`** `String`
- **`RESULT`** `ValidationResult`
  - **`valid`** `Boolean`
  - **`errors`** `Object`
    - **`<attribute>`** `String[]`

## Authentication Api non modularized dynamics

Auth dynamic has a set of dynamics that can be used across different modules.

### authenticatable-from-id

- **`PAYLOAD`** `Object`
  - **`id`** `String | Number | BigInt`
- **`RESULT`** `Authenticatable`

### generate-concern-secret

- **`PAYLOAD`** `Object`
  - **`concern`** `String`
  - **`identifier`** `String`
- **`RESULT`** `String`

### generate-one-time-password

- **`PAYLOAD`** `Object`
  - **`concern`** `String`
  - **`identifier`** `String`
- **`RESULT`** `String`

### save-authenticatable

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `void`

### verify-one-time-password

- **`PAYLOAD`** `Object`
  - **`concern`** `String`
  - **`identifier`** `String`
  - **`oneTimePassword`** `String`
- **`RESULT`** `Boolean`

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).

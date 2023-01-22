# Authentication

[![npm version](https://badge.fury.io/js/@universal-packages%2Fauthentication.svg)](https://www.npmjs.com/package/@universal-packages/authentication)
[![Testing](https://github.com/universal-packages/universal-authentication/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-authentication/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-authentication/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-authentication)

Dynamic authentication api. Extremely configurable authentication system with a default sweet spot. By itself the authentication system is agnostic to the transport used to authenticate users, you need to mount this in express routes for example, and then depending the results of the dynamics respond to your users with the adequate messages and data.

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

const result = await authentication.performDynamic('log-in', { credential: 'username', password: '12345678' })

console.log(result)

// > { status: 'success', authenticatable: { id: 69, username: 'username', createdAt: [Date] } }
```

By default authentication comes packed with a whole default auth system, but we can override all or part of the system by creating non default dynamics in your dynamics location with the extension prefix `auth-dynamic`, ex: `LogIn.auth-dynamic.js` and export ad default dynamic class there. More about all the dynamics that can be override below.

### Options

Authentication take options similar to [DynamicApi options](https://github.com/universal-packages/universal-dynamic-api#options):

- **`debug`** `Boolean`
  If true the instance of this authentication dynamic api will keep track of what is being performed into a log.

- **`dynamicsLocation`** `Required` `String`
  Where to look up for dynamics to load withe to override default ones or new ones.

- **`secret`** `Required` `String`
  Secret used for cryptography to generate tokens and verifying them for this authentication instance in particular.

- **`email`** `AuthenticationCredentialOptions`
  Options related to email authentication

  - **`confirmationGracePeriod`** `String` `ex: 2 days`
    If provided an authenticatable will need to confirm its email before this time or log in will not work until confirmed.
  - **`enableConfirmation`** `Boolean`
    If true all confirmation behavior will take place, like verifying grace period or if an authenticatable needs to be confirmed to continue log-in.
  - **`enableCorroboration`** `Boolean`
    If true before signing up the email should be corroborated.
  - **`enableMultiFactor`** `Boolean`
    If true, and if the authenticatable has it configured,to complete a log in with email, the authenticatable needs to verify multi-factor.
  - **`enablePasswordCheck`** `Boolean` `default: true`
    If true a password will be required at login if the authenticatable has it set.
  - **`enableSignUpInvitations`** `Boolean`
    If true an authenticatable can sign up using an invitation as well as sending them.
  - **`enforceMultiFactor`** `Boolean`
    If true, to complete a log in with email, the authenticatable always needs to verify multi-factor.
  - **`enforceConfirmation`** `Boolean`
    If true, an authenticatable always need to be confirmed to be able to log in.
  - **`enforcePasswordCheck`** `Boolean` `default: true`
    If true a password will be required at login always.
  - **`enforceSignUpInvitations`** `Boolean`
    If true an authenticatable can only sign up if an invitation was issued for it.
  - **`sendMultiFactorInPlace`** `Boolean`
    If true, the `send-multi-factor` dynamic will be performed after successfully logging in, if false, it will be need to be sent later, useful to let the user select a channel to end the multi-factor.

- **`enableLocking`** `Boolean`
  if true, an authenticatable can be locked after several failed log in attempts.

- **`enableLogInCount`** `Boolean`
  if true, every time an authenticatable login successfully the count will be up and saved.

- **`maxAttemptsUntilLock`** `Number` `default: 5`
  After how many failed log in attempts an authenticatable should be locked.

- **`multiFactorActivityLimit`** `String` `default: 5 minutes`
  After a successful login first step, for how much time should we consider the multi factor as active?, if the time has passed the user should do the first step again.

- **`phone`** `AuthenticationCredentialOptions`
  Options related to phone authentication

  - **`confirmationGracePeriod`** `String` `ex: 2 days`
    If provided an authenticatable will need to confirm its phone before this time or log in will not work until confirmed (for phone usually we corroborate at sign up so this is not a dynamic commonly used).
  - **`enableConfirmation`** `Boolean`
    If true all confirmation behavior will take place, like verifying grace period or if an authenticatable needs to be confirmed to continue log-in.
  - **`enableMultiFactor`** `Boolean` `default: true`
    If true, and if the authenticatable has it configured,to complete a log in with phone, the authenticatable needs to verify multi-factor.
  - **`enablePasswordCheck`** `Boolean`
    If true a password will be required at login if the authenticatable has it set.
  - **`enableCorroboration`** `Boolean` `default: true`
    If true before signing up the phone should be corroborated.
  - **`enableSignUpInvitations`** `Boolean`
    If true an authenticatable can sign up using an invitation as well as sending them.
  - **`enforceMultiFactor`** `Boolean` `default: true`
    If true, to complete a log in with phone, the authenticatable always needs to verify multi-factor.
  - **`enforceConfirmation`** `Boolean`
    If true, an authenticatable always need to be confirmed to be able to log in.
  - **`enforcePasswordCheck`** `Boolean`
    If true a password will be required at login always.
  - **`enforceSignUpInvitations`** `Boolean`
    If true an authenticatable can only sign up if an invitation was issued for it.
  - **`sendMultiFactorInPlace`** `Boolean`
    If true, the `send-multi-factor` dynamic will be performed after successfully logging in, if false, it will be need to be sent later, useful to let the user select a channel to end the multi-factor.

- **`providerKeys`** `{ provider: Object }`
  If a provider dynamic needs a set of keys here they should be placed to be read inside the dynamic.

- **`unlockAfter`** `String` `ex: 1 hour`
  When an authenticatable is locked it automatically unlocks after this time has passed.

- **`validations`** `AttributesValidationOptions`
  Options related to how every assignable attribute should be validated at sign up/reset password dynamics.

  ```
  Defaults:
    - password:
      - size:
        - min: 8
        - max: 256
    - username:
      - matcher: /^[a-zA-Z.0-9_\-&]+$/i
    - email:
      - is email
      - uniqueness
    - phone:
      - is phone number
      - uniqueness
  ```

  `email`, `firstName`, `lastName`, `name`, `password`, `phone`, `username`

  - **`<attribute>`** `ValidationOptions | false`
    - **`optional`** `Boolean`
      If true, when the value should be validated but the value is not set, the validation is not ran.
    - **`matcher`** `Regex`
      A regex expression to validate value format.
    - **`size`** `{ min?: number; max?: number }`
      If provided teh value length should be between `min` and/or `max`.
    - **`validator`** `Regex`
      A validator function for a custom coded validation.

## Authenticatable

Internally this auth system will handle an abstract `Authenticatable` class, we need to provided it in order for the whole thing to work.

```js
import User from './User'

authentication.setAuthenticatable(User)
```

```js
import { Encrypt } from '@universal-packages/authentication'

export default class User {
  id

  profilePictureUrl

  email
  emailConfirmedAt
  unconfirmedEmail

  phone
  phoneConfirmedAt
  unconfirmedPhone

  username

  failedLogInAttempts
  lockedAt

  logInCount

  multiFactorEnabled
  multiFactorActiveAt

  @Encrypt()
  password
  encryptedPassword

  firstName
  lastName
  name

  inviterId

  createdAt
  updatedAt

  save() {}

  static existsWithCredential(credentialKind, credential) {}
  static existsWithUsername(username) {}
  static findById() {}
  static findByCredential(credential) {}
  static findByProviderId(provider, id) {}
}
```

### Encrypt decorator

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

## Default main dynamics

### connect-provider `Async`

Connects an authenticatable with provider (sets and identifier so we know they are connected).

```js
const result = authentication.perform('connect-provider', { authenticatable, provider: 'github', token: 'token' })
```

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
  - **`provider`** `String`
  - **`token`** `String`
- **`RESULT`** `AuthenticationResult`
  - **`authenticatable`** `Authenticatable`
  - **`message?`**
    - `already-connected`
    - `provider-error`

### continue-with-provider `Async`

It validates the provider and gets the user data and either, gets the user already connected and returns it or create a new one with provider user data.

```js
const result = authentication.perform('continue-with-provider', { provider: 'github', token: 'token' })
```

- **`PAYLOAD`** `Object`
  - **`provider`** `String`
  - **`token`** `String`
- **`RESULT`** `AuthenticationResult`
  - **`authenticatable`** `Authenticatable`
  - **`message?`**
    - `already-connected` `warning`
    - `provider-error` `failure`

### invite-authenticatable `Async`

Creates an invitation and performs the `send-invitation` dynamic passing the invitation.

```js
const result = authentication.perform('invite-authenticatable', { provider: 'github', token: 'token' })
```

- **`PAYLOAD`** `Object`
  - **`credential`** `String`
  - **`credentialKind`** `email | phone`
  - **`inviterId`** `String | Number | BigInt`
- **`RESULT`** `AuthenticationResult`
  - **`message?`**
    - `invitations-disabled` `failure`

### log-in `Async`

Verifies credentials and if all configured behavior is positive it returns the authenticatable for which the credentials matched.

```js
const result = authentication.perform('log-in', { credential: 'username | email | phone', password: 'password' })
```

- **`PAYLOAD`** `Object`
  - **`credential`** `String`
  - **`password`** `String`
- **`RESULT`** `AuthenticationResult`
  - **`authenticatable`** `Authenticatable`
  - **`message?`**
    - `confirmation-required` `warning`
    - `multi-factor-inbound` `warning`
    - `multi-factor-waiting` `warning`
    - `invalid-credentials` `failure`

### request-confirmation `Async`

Generates a confirmation and performs the `send-confirmation` dynamic passing the one time password.

This happens when signing up and the conformation is pending, or when time has passed and a user request it manually.

```js
const result = authentication.perform('request-confirmation', { credential: 'email', credentialKind: 'email' })
```

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable` `optional`
  - **`credential`** `String` `optional if authenticatable provided`
  - **`credentialKind`** `email | phone`
- **`RESULT`** `AuthenticationResult`
  - **`message?`**
    - `nothing-to-do` `warning`
    - `confirmation-disabled` `failure`

### request-corroboration `Async`

Generates a corroboration and performs the `send-corroboration` dynamic passing the one time password..

This happens when signing up requires pre confirmation of credential, the user first request a confirmation.

```js
const result = authentication.perform('request-confirmation', { credential: 'phone', credentialKind: 'phone' })
```

- **`PAYLOAD`** `Object`
  - **`credential`** `String`
  - **`credentialKind`** `email | phone`
- **`RESULT`** `AuthenticationResult`
  - **`message?`**
    - `corroboration-disabled` `failure`

### request-multi-factor `Async`

Generates a multi factor and performs the `send-multi-factor` dynamic passing the one time password.

This happens when logging in and when the user request another one time password to continue logging in.

```js
const result = authentication.perform('request-multi-factor', { credential: 'email', credentialKind: 'email' })
```

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable` `optional`
  - **`credential`** `String` `optional if authenticatable provided`
  - **`credentialKind`** `email | phone`
- **`RESULT`** `AuthenticationResult`
  - **`message?`**
    - `nothing-to-do` `warning`
    - `confirmation-disabled` `failure`

### request-password-reset `Async`

Generates a password reset and performs the `send-password-reset` dynamic passing the one time password.

```js
const result = authentication.perform('request-password-reset', { credential: 'email', credentialKind: 'email' })
```

- **`PAYLOAD`** `Object`
  - **`credential`** `String`
  - **`credentialKind`** `email | phone`
- **`RESULT`** `AuthenticationResult`
  - **`message?`**
    - `nothing-to-do` `warning`

### request-unlock `Async`

Generates an unlock and performs the `send-multi-factor` dynamic passing the one time password.

This ideally happens when logging ig locks the authenticatable and users can not request this manually.

```js
const result = authentication.perform('request-unlock', { authenticatable, credentialKind: 'email' })
```

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
  - **`credentialKind`** `email | phone`
- **`RESULT`** `AuthenticationResult`

### sign-up `Async`

Validates sign up attributes, invitation or corroboration and if all configured behavior is valid creates the new authenticatable.

```js
const result = authentication.perform('sign-up', { attributes: { email: 'some email', password: 'some password' }, credentialKind: 'email', corroborationToken: 'token' })
```

- **`PAYLOAD`** `Object`
  - **`attributes`** `AssignableAttributes`
    - **`attributes`** `AssignableAttributes`
      - **`email`** `String` `if credentialKind is email`
      - **`username`** `String`
      - **`phone`** `String` `if credentialKind is phone`
      - **`password`** `String` `presence depend on validation`
      - **`firstName`** `String` `presence depend on validation`
      - **`lastName`** `String` `presence depend on validation`
      - **`name`** `String`
  - **`credentialKind`** `email | phone`
  - **`corroborationToken`** `String` `optional`
  - **`invitationToken`** `String` `optional`
- **`RESULT`** `AuthenticationResult`
  - **`authenticatable`** `Authenticatable`
  - **`metadata`** `Object`
    - **`credential`** `String`
    - **`credentialKind`** `email | phone`
  - **`validation`** `ValidationResult` `failure`
    - **`valid`** `Boolean`
    - **`errors`** `Object`
      - **`<attribute>`** `String[]`
  - **`message?`**
    - `invalid-invitation` `failure`
    - `invitation-required` `failure`
    - `invalid-corroboration` `failure`
    - `corroboration-required` `failure`
    - `confirmation-inbound` `warning` `metadata`

### update-authenticatable `Async`

Validates and updates an authenticatable with new attributes.

```js
const result = authentication.perform('update-authenticatable', { attributes: { firstName: 'Pepé' }, authenticatable })
```

- **`PAYLOAD`** `Object`
  - **`attributes`** `AssignableAttributes`
    - **`attributes`** `AssignableAttributes`
      - **`username`** `String`
      - **`password`** `String`
      - **`firstName`** `String`
      - **`lastName`** `String`
      - **`name`** `String`
      - **`profilePictureUrl`** `String`
      - **`multiFactorEnabled`** `Boolean`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `AuthenticationResult`
  - **`authenticatable`** `Authenticatable`
  - **`validation`** `ValidationResult` `failure`
    - **`valid`** `Boolean`
    - **`errors`** `Object`
      - **`<attribute>`** `String[]`

### update-credential `Async`

Validates and updates an authenticatable credential, taking corroboration and confirmation into account.

```js
const result = authentication.perform('update-credential', { credential: 'phone-like', credentialKind: 'phone' })
```

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
  - **`corroborationToken`** `String` `optional`
  - **`credential`** `String`
  - **`credentialKind`** `email | phone`
- **`RESULT`** `AuthenticationResult`
  - **`authenticatable`** `Authenticatable`
  - **`validation`** `ValidationResult` `failure`
    - **`valid`** `Boolean`
    - **`errors`** `Object`
      - **`<attribute>`** `String[]`

### update-credential `Async`

Validates and updates an authenticatable credential

```js
const result = authentication.perform('update-credential', { credential: 'phone-like', credentialKind: 'phone' })
```

- **`PAYLOAD`** `Object`
  - **`credential`** `String`
  - **`credentialKind`** `email | phone`
- **`RESULT`** `AuthenticationResult`
  - **`authenticatable`** `Authenticatable`
  - **`validation`** `ValidationResult` `failure`
    - **`valid`** `Boolean`
    - **`errors`** `Object`
      - **`<attribute>`** `String[]`

### verify-confirmation `Async`

Confirms an authenticatable if the one time password id valid.

```js
const result = authentication.perform('verify-confirmation, { credential: 'email', credentialKind: 'email', oneTimePassword: '123456' })
```

- **`PAYLOAD`** `Object`
  - **`credential`** `String`
  - **`credentialKind`** `email | phone`
  - **`oneTimePassword`** `String`
- **`RESULT`** `AuthenticationResult`
  - **`authenticatable`** `Authenticatable`
  - **`message?`**
    - `invalid-one-time-password` `failure`

### verify-corroboration `Async`

Corroborates a credential if the one time password id valid.

```js
const result = authentication.perform('verify-corroboration', { credential: 'email', credentialKind: 'email', oneTimePassword: '123456' })
```

- **`PAYLOAD`** `Object`
  - **`credential`** `String`
  - **`credentialKind`** `email | phone`
  - **`oneTimePassword`** `String`
- **`RESULT`** `AuthenticationResult`
  - **`metadata`** `Object`
    - **`corroborationToken`** `String`
  - **`message?`**
    - `invalid-one-time-password` `failure`

### verify-multi-factor `Async`

Verifies a multi-factor and let the logging in continue if all configured behavior is valid.

```js
const result = authentication.perform('verify-multi-factor', { credential: 'email', credentialKind: 'email', oneTimePassword: '123456' })
```

- **`PAYLOAD`** `Object`
  - **`identifier`** `String`
  - **`oneTimePassword`** `String`
- **`RESULT`** `AuthenticationResult`
  - **`authenticatable`** `Authenticatable`
  - **`message?`**
    - `invalid-one-time-password` `failure`
    - `confirmation-required` `warning`

### verify-password-reset `Async`

Verifies a password reset and sets a new password

```js
const result = authentication.perform('verify-password-reset', { credential: 'email', credentialKind: 'email', oneTimePassword: '123456', password: 'new password' })
```

- **`PAYLOAD`** `Object`
  - **`identifier`** `String`
  - **`oneTimePassword`** `String`
  - **`password`** `String`
- **`RESULT`** `AuthenticationResult`
  - **`validation`** `ValidationResult` `failure`
    - **`valid`** `Boolean`
    - **`errors`** `Object`
      - **`<attribute>`** `String[]`
  - **`message?`**
    - `invalid-one-time-password` `failure`

### verify-unlock `Async`

Verifies an unlock and unlocks the authenticatable.

```js
const result = authentication.perform('verify-unlock', { credential: 'email', credentialKind: 'email', oneTimePassword: '123456' })
```

- **`PAYLOAD`** `Object`
  - **`identifier`** `String`
  - **`oneTimePassword`** `String`
- **`RESULT`** `AuthenticationResult`
  - **`authenticatable`** `Authenticatable`
  - **`message?`**
    - `invalid-one-time-password` `failure`

## Default extended dynamics

The extended dynamics are meant to be override in case your Authenticatable behaves differently of what this authentication defaults expect, for example if we set the password of an authenticatable in a custom manner of if we save it differently than expected.

### authenticatable-from-credential

- **`PAYLOAD`** `Object`
  - **`credential`** `String`
- **`RESULT`** `Authenticatable`

### authenticatable-from-id

- **`PAYLOAD`** `Object`
  - **`id`** `String | Number | BigInt`
- **`RESULT`** `Authenticatable`

### authenticatable-from-provider-id

- **`PAYLOAD`** `Object`
  - **`provider`** `String`
  - **`id`** `String | Number | BigInt`
- **`RESULT`** `Authenticatable`

### authenticatable-from-provider-user-data

- **`PAYLOAD`** `Object`
  - **`provider`** `String`
  - **`attributes`** `ProviderDataAttributes`
    - **`id`**`String | Number | BigInt`
    - **`email`** `String`
    - **`firstName`** `String`
    - **`lastName`** `String`
    - **`name`** `String`
    - **`profilePictureUrl`** `String`
    - **`username`** `String`
- **`RESULT`** `Authenticatable`

### authenticatable-from-sign-up

- **`PAYLOAD`** `Object`
  - **`attributes`** `AssignableAttributes`
    - **`email`** `String`
    - **`firstName`** `String`
    - **`lastName`** `String`
    - **`name`** `String`
    - **`password`** `String`
    - **`phone`** `String`
    - **`username`** `String`
  - **`credentialKind`** `email | phone`
  - **`corroboration`** `Corroboration`
    - **`credential`** `String`
    - **`credentialKind`** `email | phone`
  - **`invitation`** `Invitation`
    - **`credential`** `String`
    - **`credentialKind`** `email | phone`
    - **`inviterId`**`String | Number | BigInt`
- **`RESULT`** `Authenticatable`

### credential-kind-from-credential-authenticatable

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
  - **`credential`** `String`
- **`RESULT`** `email | phone`

### decrypt-corroboration-token

- **`PAYLOAD`** `Object`
  - **`token`** `String`
- **`RESULT`** `Corroboration`
  - **`credential`** `String`
  - **`credentialKind`** `email | phone`

### decrypt-invitation-token

- **`PAYLOAD`** `Object`
  - **`token`** `String`
- **`RESULT`** `Invitation`
  - **`credential`** `String`
  - **`credentialKind`** `email | phone`
  - **`inviterId`**`String | Number | BigInt`

### does-authenticatable-have-password?

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `Boolean`

### does-authenticatable-requires-multi-factor?

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `Boolean`

### encrypt-corroboration

- **`PAYLOAD`** `Object`
  - **`corroboration`** `Corroboration`
    - **`credential`** `String`
    - **`credentialKind`** `email | phone`
- **`RESULT`** `String`

### encrypt-invitation

- **`PAYLOAD`** `Object`
  - **`invitation`** `Invitation`
    - **`credential`** `String`
    - **`credentialKind`** `email | phone`
    - **`inviterId`**`String | Number | BigInt`
- **`RESULT`** `String`

### generate-concern-secret

- **`PAYLOAD`** `Object`
  - **`concern`** `confirmation | corroboration | invitation | log-in | multi-factor | password-reset | sign-up | unlock`
  - **`identifier`** `String`
- **`RESULT`** `String`

### generate-multi-factor-metadata

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `MultiFactorMetadata`
  - **`identifier`** `String`
  - **`email`** `String`
  - **`phone`** `String`

### generate-one-time-password

- **`PAYLOAD`** `Object`
  - **`concern`** `confirmation | corroboration | invitation | log-in | multi-factor | password-reset | sign-up | unlock`
  - **`identifier`** `String`
- **`RESULT`** `String`

### has-authenticatable-confirmation-passed-grace-period?

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
  - **`credentialKind`** `email | phone`
- **`RESULT`** `Boolean`

### is-authenticatable-confirmed?

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
  - **`credentialKind`** `email | phone`
- **`RESULT`** `Boolean`

### is-authenticatable-connected?

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
  - **`provider`** `String`
- **`RESULT`** `Boolean`

### is-authenticatable-lockable?

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `Boolean`

### is-authenticatable-locked?

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `Boolean`

### is-authenticatable-multi-factor-active?

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `Boolean`

### is-authenticatable-password?

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
  - **`password`** `String`
- **`RESULT`** `Boolean`

### is-authenticatable-ready-to-unlock?

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `Boolean`

### save-authenticatable

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `void`

### send-confirmation

- **`PAYLOAD`** `Object`
  - **`credential`** `String`
  - **`credentialKind`** `email | phone`
  - **`oneTimePassword`** `String`
- **`RESULT`** `void`

### send-corroboration

- **`PAYLOAD`** `Object`
  - **`credential`** `String`
  - **`credentialKind`** `email | phone`
  - **`oneTimePassword`** `String`
- **`RESULT`** `void`

### send-invitation

- **`PAYLOAD`** `Object`
  - **`credential`** `String`
  - **`credentialKind`** `email | phone`
  - **`invitationToken`** `String`
- **`RESULT`** `void`

### send-multi-factor

- **`PAYLOAD`** `Object`
  - **`identifier`** `String`
  - **`credential`** `String`
  - **`credentialKind`** `email | phone`
  - **`oneTimePassword`** `String`
- **`RESULT`** `void`

### send-password-reset

- **`PAYLOAD`** `Object`
  - **`identifier`** `String`
  - **`credential`** `String`
  - **`credentialKind`** `email | phone`
  - **`oneTimePassword`** `String`
- **`RESULT`** `void`

### send-unlock

- **`PAYLOAD`** `Object`
  - **`credential`** `String`
  - **`credentialKind`** `email | phone`
  - **`oneTimePassword`** `String`
- **`RESULT`** `void`

### set-authenticatable-attributes

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
  - **`attributes`** `AssignableAttributes`
    - **`firstName`** `String`
    - **`lastName`** `String`
    - **`multiFactorEnabled`** `String`
    - **`name`** `String`
    - **`password`** `String`
    - **`profilePictureUrl`** `String`
    - **`username`** `String`
  - **`include`** `AttributeName[]`
  - **`exclude`** `AttributeName[]`
- **`RESULT`** `void`

### set-authenticatable-confirmed

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
  - **`credentialKind`** `email | phone`
- **`RESULT`** `void`

### set-authenticatable-fail-attempt

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `void`

### set-authenticatable-locked

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `void`

### set-authenticatable-log-in-count

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `void`

### set-authenticatable-multi-factor-active

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `void`

### set-authenticatable-multi-factor-inactive

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `void`

### set-authenticatable-password

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
  - **`password`** `String`
- **`RESULT`** `void`

### set-authenticatable-profile-picture

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
  - **`pictureUrl`** `String`
- **`RESULT`** `void`

### set-authenticatable-provider-id

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
  - **`provider`** `String`
  - **`id`** `String | Number | BigInt`
- **`RESULT`** `void`

### set-authenticatable-unconfirmed-credential

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
  - **`credential`** `String`
  - **`credentialKind`** `email | phone`
- **`RESULT`** `void`

### set-authenticatable-unlocked

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
- **`RESULT`** `void`

### stablish-authenticatable-unconfirmed-credential

- **`PAYLOAD`** `Object`
  - **`authenticatable`** `Authenticatable`
  - **`credentialKind`** `email | phone`
- **`RESULT`** `void`

### validate-attributes

- **`PAYLOAD`** `Object`
  - **`attributes`** `AssignableAttributes`
    - **`email`** `String`
    - **`firstName`** `String`
    - **`lastName`** `String`
    - **`name`** `String`
    - **`password`** `String`
    - **`phone`** `String`
    - **`username`** `String`
  - **`include`** `AttributeName[]`
  - **`exclude`** `AttributeName[]`
  - **`allOptional`** `Boolean`
- **`RESULT`** `ValidationResult`
  - **`valid`** `Boolean`
  - **`errors`** `Object`
    - **`<attribute>`** `String[]`

### verify-one-time-password

- **`PAYLOAD`** `Object`
  - **`concern`** `confirmation | corroboration | invitation | log-in | multi-factor | password-reset | sign-up | unlock`
  - **`credential`** `String`
  - **`credentialKind`** `email | phone`
  - **`oneTimePassword`** `email | phone`
- **`RESULT`** `Boolean`

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).

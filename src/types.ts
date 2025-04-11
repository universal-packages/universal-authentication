import { DynamicModule } from '@universal-packages/dynamic-api'
import { VerifyOptions } from '@universal-packages/time-based-one-time-password'

export type ExtensibleUnion<T extends U, U = string | number | symbol> = T | (U & { zz__ignore?: never })
export interface AuthenticationOptions {
  debug?: boolean
  defaultModule?: DynamicModule<DefaultModuleOptions>
  dynamicsLocation: string
  initialDetails?: InitialDetailsOptions
  modules?: Record<string, DynamicModule>
  oneTimePassword?: VerifyOptions
  secret: string
}

export interface InitialDetailsOptions {
  localeValidation?: {
    optional?: boolean
  }
  timezoneValidation?: {
    optional?: boolean
  }
}
export interface DefaultModuleOptions {
  emailValidation?: {
    matcher?: RegExp | string
    size?: { min?: number; max?: number }
  }
  passwordValidation?: {
    size?: { min?: number; max?: number }
  }
}

export interface ValidationResult {
  errors: { [name: string]: string[] }
  valid: boolean
}

export interface AuthenticationResult<U = Record<string, any>, M = Record<string, any>> {
  user?: U
  message?: string
  metadata?: M
  status: 'success' | 'failure' | 'warning'
  validation?: ValidationResult
}

export interface DefaultModuleDynamicNames<U = Record<string, any>> extends AuthDynamicNames<U> {
  'log-in': { payload: EmailPasswordPayload; result: AuthenticationResult }
  'continue-before-log-in?': { payload: EmailPasswordPayload; result: boolean }
  'continue-after-user-found?': { payload: UserPayload<U>; result: boolean }
  'after-log-in-success': { payload: UserPayload<U>; result: void }
  'after-log-in-failure': { payload: UserPayload<U>; result: void }
  'after-log-in-user-not-found': { payload: EmailPayload; result: void }

  'sign-up': { payload: EmailPasswordAndDetailsPayload; result: AuthenticationResult }
  'continue-before-sign-up?': { payload: EmailPasswordPayload; result: boolean }
  'after-sign-up-success': { payload: UserPayload<U>; result: void }
  'after-sign-up-failure': { payload: EmailPasswordValidationPayload; result: void }

  'request-password-reset': { payload: EmailPayload; result: AuthenticationResult }
  'verify-password-reset': { payload: EmailPasswordOneTimePasswordPayload; result: AuthenticationResult }

  'update-email-password': { payload: UpdateEmailPasswordPayload<U>; result: AuthenticationResult }
  'after-update-success': { payload: UserPayload<U>; result: void }

  'user-from-email': { payload: EmailPayload; result: U }
  'user-exists-with-email?': { payload: EmailPayload; result: boolean }
  'do-passwords-match?': { payload: PasswordsPayload; result: boolean }
  'get-user-current-email': { payload: UserPayload<U>; result: string }
  'get-user-encrypted-password': { payload: UserPayload<U>; result: string }
  'send-password-reset': { payload: UserOneTimePasswordPayload; result: void }
  'send-password-was-reset': { payload: UserPayload<U>; result: void }
  'send-welcome': { payload: UserPayload<U>; result: void }

  'validate-log-in': { payload: EmailPasswordPayload; result: ValidationResult }
  'validate-password-reset': { payload: PasswordPayload; result: ValidationResult }
  'validate-sign-up': { payload: EmailPasswordAndDetailsPayload; result: ValidationResult }
  'validate-update': { payload: EmailPasswordCurrentEmailPayload; result: ValidationResult }
}

export interface EmailPayload {
  email: string
}

export interface EmailPasswordPayload {
  email: string
  password: string
}

export interface EmailPasswordAndDetailsPayload {
  email: string
  password: string
  locale?: string
  timezone?: string
}

export interface EmailOneTimePasswordPayload {
  email: string
  oneTimePassword: string
}

export interface EmailPasswordOneTimePasswordPayload {
  email: string
  password: string
  oneTimePassword: string
}

export interface UserPayload<U = Record<string, any>> {
  user: U
}

export interface EmailPasswordCurrentEmailPayload {
  currentEmail: string
  email: string
  password: string
}

export interface UserOneTimePasswordPayload {
  user: Record<string, any>
  oneTimePassword: string
}

export interface EmailPasswordValidationPayload {
  email: string
  password: string
  validation: ValidationResult
}

export interface PasswordsPayload {
  password: string
  encryptedPassword: string
}

export interface UpdateEmailPasswordPayload<U = Record<string, any>> {
  user: U
  email?: string
  password?: string
}

export interface VerifyEmailPasswordResetPayload {
  email: string
  oneTimePassword: string
  password: string
}

export interface AuthDynamicNames<U = Record<string, any>> {
  'create-user': { payload: CreateUserPayload; result: U }
  'encrypt-password': { payload: PasswordPayload; result: string }
  'generate-concern-secret': { payload: GenerateConcernSecretPayload; result: string }
  'generate-one-time-password': { payload: GenerateOneTimePasswordPayload; result: string }
  'update-user': { payload: UpdateUserPayload<U>; result: U }
  'user-from-id': { payload: IdPayload; result: U }
  'verify-one-time-password': { payload: VerifyOneTimePasswordPayload; result: boolean }
}

export interface CreateUserPayload<U = Record<string, any>> {
  attributes: U
}

export interface IdPayload {
  id: string | number | bigint
}
export interface GenerateConcernSecretPayload {
  concern: string
  identifier: string
}

export interface GenerateOneTimePasswordPayload {
  concern: string
  identifier: string
}

export interface UpdateUserPayload<U = Record<string, any>> {
  user: U
  attributes: U
}

export interface PasswordPayload {
  password: string
}

export interface VerifyOneTimePasswordPayload {
  concern: string
  identifier: string
  oneTimePassword: string
}

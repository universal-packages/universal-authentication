import { DynamicModule } from '@universal-packages/dynamic-api'
import { VerifyOptions } from '@universal-packages/time-based-one-time-password'

export type ExtensibleUnion<T extends U, U = string | number | symbol> = T | (U & { zz__ignore?: never })
export interface AuthenticationOptions {
  debug?: boolean
  defaultModule?: DynamicModule<DefaultModuleOptions>
  dynamicsLocation: string
  modules?: Record<string, DynamicModule>
  oneTimePassword?: VerifyOptions
  secret: string
}

export interface DefaultModuleOptions {
  emailValidation?: {
    matcher?: RegExp
    size?: { min?: number; max?: number }
  }
  passwordValidation?: {
    size?: { min?: number; max?: number }
  }
}

export interface Authenticatable {
  id: number | bigint | string
}

export interface AuthenticatableClass<A = Authenticatable> {
  new (...args: any[]): A
  fromId: (id: string | number | bigint) => Promise<Authenticatable>
}

export interface DefaultModuleAuthenticatable {
  id: number | bigint | string
  email: string
  password: string
  encryptedPassword: string
  save: () => Promise<void>
}

export interface DefaultModuleAuthenticatableClass extends AuthenticatableClass<DefaultModuleAuthenticatable> {
  existsWithEmail: (email: string) => Promise<boolean>
  fromEmail: (email: string) => Promise<DefaultModuleAuthenticatable>
}

export interface ValidationResult {
  errors: { [name: string]: string[] }
  valid: boolean
}

export interface AuthenticationResult<M = Record<string, any>> {
  authenticatable?: Authenticatable
  message?: string
  metadata?: M
  status: 'success' | 'failure' | 'warning'
  validation?: ValidationResult
}

export interface DefaultModuleDynamicNames {
  'log-in': { payload: EmailPasswordPayload; result: AuthenticationResult }
  'continue-before-log-in?': { payload: EmailPasswordPayload; result: boolean }
  'continue-after-authenticatable-found?': { payload: AuthenticatablePayload; result: boolean }
  'after-log-in-success': { payload: AuthenticatablePayload; result: void }
  'after-log-in-failure': { payload: AuthenticatablePayload; result: void }
  'after-log-in-authenticatable-not-found': { payload: EmailPayload; result: void }

  'sign-up': { payload: EmailPasswordPayload; result: AuthenticationResult }
  'continue-before-sign-up?': { payload: EmailPasswordPayload; result: boolean }
  'after-sign-up-success': { payload: AuthenticatablePayload; result: void }
  'after-sign-up-failure': { payload: EmailPasswordValidationPayload; result: void }

  'request-password-reset': { payload: EmailPayload; result: AuthenticationResult }
  'verify-password-reset': { payload: EmailPasswordOneTimePasswordPayload; result: AuthenticationResult }

  'update-email-password': { payload: UpdateEmailPasswordPayload; result: AuthenticationResult }
  'after-update-success': { payload: AuthenticatablePayload; result: void }

  'authenticatable-from-email': { payload: EmailPayload; result: Authenticatable }
  'authenticatable-from-sign-up-attributes': { payload: EmailPasswordPayload; result: Authenticatable }
  'authenticatable-exists-with-email?': { payload: EmailPayload; result: boolean }
  'do-passwords-match?': { payload: PasswordsPayload; result: boolean }
  'get-authenticatable-encrypted-password': { payload: AuthenticatablePayload; result: string }
  'send-password-reset': { payload: AuthenticatableOneTimePasswordPayload; result: void }
  'send-password-was-reset': { payload: AuthenticatablePayload; result: void }
  'send-welcome': { payload: AuthenticatablePayload; result: void }
  'set-authenticatable-password': { payload: AuthenticatablePasswordPayload; result: void }
  'set-authenticatable-update-attributes': { payload: UpdateEmailPasswordPayload; result: void }
  'validate-password-reset': { payload: PasswordPayload; result: ValidationResult }
  'validate-sign-up': { payload: EmailPasswordPayload; result: ValidationResult }
  'validate-update': { payload: AuthenticatableEmailPasswordPayload; result: ValidationResult }
}

export interface EmailPayload {
  email: string
}

export interface EmailPasswordPayload {
  email: string
  password: string
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

export interface AuthenticatablePayload {
  authenticatable: DefaultModuleAuthenticatable
}

export interface AuthenticatableEmailPasswordPayload {
  authenticatable: DefaultModuleAuthenticatable
  email: string
  password: string
}

export interface AuthenticatableOneTimePasswordPayload {
  authenticatable: DefaultModuleAuthenticatable
  oneTimePassword: string
}

export interface AuthenticatablePasswordPayload {
  authenticatable: DefaultModuleAuthenticatable
  password: string
}

export interface EmailPasswordValidationPayload {
  email: string
  password: string
  validation: ValidationResult
}

export interface PasswordPayload {
  password: string
}

export interface PasswordsPayload {
  password: string
  encryptedPassword: string
}

export interface UpdateEmailPasswordPayload {
  authenticatable: DefaultModuleAuthenticatable
  email?: string
  password?: string
}
export interface VerifyEmailPasswordResetPayload {
  email: string
  oneTimePassword: string
  password: string
}

export interface AuthDynamicNames {
  'authenticatable-from-id': { payload: IdPayload; result: Authenticatable }
  'generate-concern-secret': { payload: GenerateConcernSecretPayload; result: string }
  'generate-one-time-password': { payload: GenerateOneTimePasswordPayload; result: string }
  'save-authenticatable': { payload: SaveAuthenticatablePayload; result: void }
  'verify-one-time-password': { payload: VerifyOneTimePasswordPayload; result: boolean }

  zz__ignore: { payload: Record<string, any>; result: any }
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

export interface SaveAuthenticatablePayload {
  authenticatable: Authenticatable
}

export interface VerifyOneTimePasswordPayload {
  concern: string
  identifier: string
  oneTimePassword: string
}

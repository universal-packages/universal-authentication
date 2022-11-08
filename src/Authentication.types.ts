// export type ExtensibleUnion<T extends U, U = string | number | symbol> = T | (U & { __any?: never })
export type ExtensibleUnion<T> = T
export type CredentialKind = 'email' | 'phone'
export interface AuthenticationOptions {
  dynamicsLocation: string
  secret: string

  email?: AuthenticationCredentialOptions
  phone?: AuthenticationCredentialOptions

  enableLocking?: boolean
  enableLogInCount?: boolean
  enableMultiFactor?: boolean

  enforceMultiFactor?: boolean

  sendMultiFactorInPlace?: boolean

  maxAttemptsUntilLock?: number
  unlockAfter?: string
}

export interface AuthenticationCredentialOptions {
  confirmationGracePeriod?: string

  enableConfirmation?: boolean

  enablePasswordCheck?: boolean
  enableSignUpCorroboration?: boolean
  enableSignUpInvitations?: boolean

  enforceConfirmation?: boolean
  enforceSignUpInvitations?: boolean

  signUpValidations?: AuthenticationValidationsOptions
}

export interface AuthenticationValidationsOptions {
  email?: ValidationOptions | false
  firstName?: ValidationOptions | false
  lastName?: ValidationOptions | false
  name?: ValidationOptions | false
  password?: ValidationOptions | false
  phone?: ValidationOptions | false
  username?: ValidationOptions | false
}

export interface ValidationOptions {
  optional?: boolean
  matcher?: RegExp
  size?: { min?: number; max?: number }
  validator?: (value: any) => boolean
}

export interface Authenticatable {
  id: number | bigint | string

  email?: string
  emailConfirmedAt?: Date

  phone?: string
  phoneConfirmedAt?: Date

  username?: string

  failedLogInAttempts?: number
  lockedAt?: Date

  logInCount?: number

  multiFactorEnabled?: boolean
  multiFactorCurrentOneTimePassword?: string
  multiFactorCurrentOneTimePasswordSetAt?: Date

  password?: string
  encryptedPassword?: string

  firstName?: string
  lastName?: string
  name?: string

  inviterId?: number | bigint | string

  createdAt?: Date

  save: () => Promise<Authenticatable>
}

export interface AuthenticatableClass<A = Authenticatable> {
  new (...args: any[]): A
  existsWithEmail: (email: string) => Promise<boolean>
  existsWithPhone: (phone: string) => Promise<boolean>
  existsWithUsername: (username: string) => Promise<boolean>
  findByCredential: (credential: string) => Promise<Authenticatable>
}

export interface AuthDynamicPayload<B = Record<string, any>> {
  authOptions: AuthenticationOptions
  Authenticatable: AuthenticatableClass
  body: B
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

export interface SimplifiedAuthDynamicNames {
  'log-in': { payload: LogInPayload; result: AuthenticationResult }
  'sign-up': { payload: SignUpPayload; result: AuthenticationResult }
  // zz__ignore: { payload: Record<string, any>; result: any }
}

export interface AuthDynamicNames extends SimplifiedAuthDynamicNames {
  'authenticatable-from-credential': { payload: AuthenticatableFromCredentialPayload; result: Authenticatable }
  'authenticatable-from-sign-up': { payload: AuthenticatableFromSignUpPayload; result: Authenticatable }
  'credential-kind-from-credential-authenticatable': { payload: CredentialAuthenticatablePayload; result: CredentialKind }
  'decrypt-corroboration-token': { payload: TokenPayload; result: CorroborationPayload }
  'decrypt-invitation-token': { payload: TokenPayload; result: InvitationPayload }
  'does-authenticatable-requires-multi-factor?': { payload: AuthenticatablePayload; result: boolean }
  'encrypt-corroboration-payload': { payload: CorroborationPayload; result: string }
  'encrypt-invitation-payload': { payload: InvitationPayload; result: string }
  'generate-multi-factor-order-metadata': { payload: AuthenticatablePayload; result: MultiFactorOrderMetadata }
  'has-authenticatable-confirmation-passed-grace-period?': { payload: CredentialKindAuthenticatablePayload; result: boolean }
  'is-authenticatable-confirmed?': { payload: CredentialKindAuthenticatablePayload; result: boolean }
  'is-authenticatable-lockable?': { payload: AuthenticatablePayload; result: boolean }
  'is-authenticatable-locked?': { payload: AuthenticatablePayload; result: boolean }
  'is-authenticatable-password?': { payload: PasswordAuthenticatablePayload; result: boolean }
  'is-authenticatable-ready-to-unlock?': { payload: AuthenticatablePayload; result: boolean }
  'refine-sign-up-payload': { payload: SignUpPayloadRefinementPayload; result: void }
  'save-authenticatable': { payload: AuthenticatablePayload; result: void }
  'send-confirmation-request': { payload: CredentialKindAuthenticatablePayload; result: void }
  'send-corroboration-request': { payload: CredentialKindAuthenticatablePayload; result: void }
  'send-multi-factor-request': { payload: AuthenticatablePayload; result: void }
  'send-unlock-request': { payload: AuthenticatablePayload; result: void }
  'set-authenticatable-fail-attempt': { payload: AuthenticatablePayload; result: void }
  'set-authenticatable-locked': { payload: AuthenticatablePayload; result: void }
  'set-authenticatable-log-in-count': { payload: AuthenticatablePayload; result: void }
  'set-authenticatable-multi-factor': { payload: AuthenticatablePayload; result: void }
  'set-authenticatable-unlocked': { payload: AuthenticatablePayload; result: void }
  'validate-sign-up-payload': { payload: SignUpPayload; result: ValidationResult }
}

export interface AuthenticatableFromCredentialPayload {
  credential: string
}

export interface AuthenticatableFromSignUpPayload {
  corroborationPayload?: CorroborationPayload
  invitationPayload?: InvitationPayload
  signUpPayload: SignUpPayload
}

export interface AuthenticatablePayload {
  authenticatable: Authenticatable
}

export interface CorroborationPayload {
  credential: string
  credentialKind: CredentialKind
}

export interface CredentialKindAuthenticatablePayload {
  authenticatable: Authenticatable
  credentialKind: CredentialKind
}

export interface CredentialAuthenticatablePayload {
  authenticatable: Authenticatable
  credential: string
}

export interface InvitationPayload {
  inviterId: number | bigint | string
  credential: string
  credentialKind: CredentialKind
}

export interface LogInPayload {
  credential: string
  password?: string
}

export interface MultiFactorOrderMetadata {
  email?: string
  phone?: string
}

export interface PasswordAuthenticatablePayload {
  authenticatable: Authenticatable
  password: string
}

export interface SignUpPayload {
  credentialKind: CredentialKind

  email?: string
  username?: string
  phone?: string
  password?: string
  firstName?: string
  lastName?: string
  name?: string

  corroborationToken?: string
  invitationToken?: string
}

export interface SignUpPayloadRefinementPayload {
  corroborationPayload?: CorroborationPayload
  invitationPayload?: InvitationPayload
  signUpPayload: SignUpPayload
}

export interface TokenPayload {
  token: string
}

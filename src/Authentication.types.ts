// export type ExtensibleUnion<T extends U, U = string | number | symbol> = T | (U & { __any?: never })
export type ExtensibleUnion<T> = T
export type CredentialKind = 'email' | 'phone'
export interface AuthenticationOptions {
  dynamicsLocation: string
  encryptionSecret: string
  email?: AuthenticationCredentialOptions
  phone?: AuthenticationCredentialOptions
}

export interface AuthenticationCredentialOptions {
  confirmationGracePeriod?: string

  enableConfirmation?: boolean
  enableLogInCount?: boolean
  enableLocking?: boolean
  enableMultiFactor?: boolean
  enablePasswordCheck?: boolean
  enableSignUpCorroboration?: boolean
  enableSignUpInvitations?: boolean

  enforceConfirmation?: boolean
  enforceMultiFactor?: boolean
  enforceSignUpInvitations?: boolean

  maxAttemptsUntilLock?: number

  sendMultiFactorInPlace?: boolean

  signUpValidations?: AuthenticationValidationsOptions

  unlockAfter?: string
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
  id: number | bigint

  email?: string
  emailConfirmedAt?: Date
  emailFailedLogInAttempts?: number
  emailLockedAt?: Date
  emailLogInCount?: number
  emailMultiFactorEnabled?: boolean

  phone?: string
  phoneConfirmedAt?: Date
  phoneFailedLogInAttempts?: number
  phoneLockedAt?: Date
  phoneLogInCount?: number
  phoneMultiFactorEnabled?: boolean

  username?: string

  password?: string
  encryptedPassword?: string

  firstName?: string
  lastName?: string
  name?: string

  inviterId?: number | bigint

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

export interface AuthenticationResult {
  authenticatable?: Authenticatable
  message?: string
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
  'does-authenticatable-requires-multi-factor?': { payload: CredentialKindAuthenticatablePayload; result: boolean }
  'encrypt-corroboration-payload': { payload: CorroborationPayload; result: string }
  'encrypt-invitation-payload': { payload: InvitationPayload; result: string }
  'has-authenticatable-confirmation-passed-grace-period?': { payload: CredentialKindAuthenticatablePayload; result: boolean }
  'is-authenticatable-confirmed?': { payload: CredentialKindAuthenticatablePayload; result: boolean }
  'is-authenticatable-lockable?': { payload: CredentialKindAuthenticatablePayload; result: boolean }
  'is-authenticatable-locked?': { payload: CredentialKindAuthenticatablePayload; result: boolean }
  'is-authenticatable-password?': { payload: PasswordAuthenticatablePayload; result: boolean }
  'is-authenticatable-ready-to-unlock?': { payload: CredentialKindAuthenticatablePayload; result: boolean }
  'refine-sign-up-payload': { payload: SignUpPayloadRefinementPayload; result: void }
  'save-authenticatable': { payload: AuthenticatablePayload; result: void }
  'send-confirmation-request': { payload: CredentialKindAuthenticatablePayload; result: void }
  'send-corroboration-request': { payload: CredentialKindAuthenticatablePayload; result: void }
  'send-multi-factor-request': { payload: CredentialKindAuthenticatablePayload; result: void }
  'send-unlock-request': { payload: CredentialKindAuthenticatablePayload; result: void }
  'set-authenticatable-fail-attempt': { payload: CredentialKindAuthenticatablePayload; result: void }
  'set-authenticatable-locked': { payload: CredentialKindAuthenticatablePayload; result: void }
  'set-authenticatable-log-in-count': { payload: CredentialKindAuthenticatablePayload; result: void }
  'set-authenticatable-unlocked': { payload: CredentialKindAuthenticatablePayload; result: void }
  'validate-sign-up-payload': { payload: SignUpPayload; result: ValidationResult }
}

export interface AuthenticatableFromCredentialPayload {
  credential: string
}

export interface AuthenticatableFromPhoneNumberPayload {
  phone: string
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
  inviterId: bigint
  credential: string
  credentialKind: CredentialKind
}

export interface LogInPayload {
  credential: string
  password?: string
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

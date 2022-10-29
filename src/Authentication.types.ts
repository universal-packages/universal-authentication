// export type ExtensibleUnion<T extends U, U = string | number | symbol> = T | (U & { __any?: never })
export type ExtensibleUnion<T> = T

export interface AuthenticationOptions {
  dynamicsLocation: string

  encryptionSecret: string

  enableConfirmation?: boolean
  enableInvitations?: boolean
  enableLogInCount?: boolean
  enableMultiFactor?: boolean

  enforceConfirmation?: boolean
  enforceInvitations?: boolean
  enforceMultiFactor?: boolean

  lockAfterMaxFailedAttempts?: boolean
  maxAttemptsUntilLock?: number

  validations?: {
    email?: {
      optional: boolean
    }
    firstName?: {
      optional: boolean
      size?: { min?: number; max?: number }
    }
    lastName?: {
      optional: boolean
      size?: { min?: number; max?: number }
    }
    name?: {
      optional: boolean
      size?: { min?: number; max?: number }
    }
    password?: {
      optional: boolean
      size?: { min?: number; max?: number }
    }
    username?: {
      optional: boolean
      matcher?: RegExp
      size?: { min?: number; max?: number }
    }
  }

  unlockAfter?: string
}

export interface Authenticatable {
  id: bigint
  username: string
  email: string
  firstName?: string
  lastName?: string
  name?: string
  password?: string
  encryptedPassword: string
  multiFactorEnabled: boolean
  multiFactorToken: string
  resetPasswordToken: string
  logInCount: number
  confirmationToken: string
  confirmedAt: Date
  failedLogInAttempts: number
  unlockToken: string
  lockedAt: Date
  inviterId: bigint
  save: () => Promise<Authenticatable>
}

export interface AuthenticatableClass {
  new (...args: any[]): Authenticatable
  existsWithEmail: (email: string) => Promise<boolean>
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
  'decrypt-invitation-token': { payload: TokenPayload; result: InvitationPayload }
  'does-authenticatable-requires-multi-factor?': { payload: AuthenticatablePayload; result: boolean }
  'encrypt-invitation-payload': { payload: InvitationPayload; result: string }
  'is-authenticatable-confirmed?': { payload: AuthenticatablePayload; result: boolean }
  'is-authenticatable-lockable?': { payload: AuthenticatablePayload; result: boolean }
  'is-authenticatable-locked?': { payload: AuthenticatablePayload; result: boolean }
  'is-authenticatable-password?': { payload: AuthenticatablePasswordPayload; result: boolean }
  'is-authenticatable-ready-to-unlock?': { payload: AuthenticatablePayload; result: boolean }
  'save-authenticatable': { payload: AuthenticatablePayload; result: void }
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
  signUpPayload: SignUpPayload
  invitationPayload?: InvitationPayload
}

export interface AuthenticatablePayload {
  authenticatable: Authenticatable
}

export interface AuthenticatablePasswordPayload {
  authenticatable: Authenticatable
  password: string
}

export interface InvitationPayload {
  inviterId: bigint
  invitedEmail: string
}

export interface LogInPayload {
  credential: string
  password: string
}

export interface SignUpPayload {
  email: string
  username: string
  password: string
  firstName?: string
  lastName?: string
  name?: string
  invitationToken?: string
}

export interface TokenPayload {
  token: string
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ConnectBody {
  plugin: string
  token: string
}

export interface RequestMagicLoginBody {
  credential: string
}

export interface MagicLoginBody {
  token: string
}

export interface ConfirmationBody {
  token: string
}

export interface RequestResetPasswordBody {
  credential: string
}

export interface ResetPasswordBody {
  token: string
  password: string
}

export interface UnlockBody {
  token: string
}

export interface InviteBody {
  email: string
}

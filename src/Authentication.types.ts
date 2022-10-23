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
  state: 'success' | 'failure' | 'warning'
  validation?: ValidationResult
}

export interface SimplifiedAuthDynamicNames {
  'log-in': { payload: LogInBody; result: AuthenticationResult }
  'sign-up': { payload: SignUpBody; result: AuthenticationResult }
  // zz__ignore: { payload: Record<string, any>; result: any }
}

export interface AuthDynamicNames extends SimplifiedAuthDynamicNames {
  'authenticatable-by-credential': { payload: CredentialBody; result: Authenticatable }
  'authenticatable-from-sign-up-payload': { payload: SignUpPayload; result: Authenticatable }
  'decrypt-invitation-token': { payload: TokenBody; result: InvitationPayload }
  'does-authenticatable-requires-multi-factor?': { payload: AuthenticatableBody; result: boolean }
  'encrypt-invitation-payload': { payload: InvitationPayload; result: string }
  'is-authenticatable-confirmed?': { payload: AuthenticatableBody; result: boolean }
  'is-authenticatable-lockable?': { payload: AuthenticatableBody; result: boolean }
  'is-authenticatable-locked?': { payload: AuthenticatableBody; result: boolean }
  'is-authenticatable-password?': { payload: AuthenticatablePasswordBody; result: boolean }
  'is-authenticatable-ready-to-unlock?': { payload: AuthenticatableBody; result: boolean }
  'save-authenticatable': { payload: AuthenticatableBody; result: void }
  'set-authenticatable-fail-attempt': { payload: AuthenticatableBody; result: void }
  'set-authenticatable-locked': { payload: AuthenticatableBody; result: void }
  'set-authenticatable-log-in-count': { payload: AuthenticatableBody; result: void }
  'set-authenticatable-multi-factor': { payload: AuthenticatableBody; result: void }
  'set-authenticatable-unlocked': { payload: AuthenticatableBody; result: void }
  'validate-sign-up-body': { payload: SignUpBody; result: ValidationResult }
}

export interface CredentialBody {
  credential: string
}

export interface AuthenticatableBody {
  authenticatable: Authenticatable
}

export interface AuthenticatablePasswordBody {
  authenticatable: Authenticatable
  password: string
}

export interface LogInBody {
  credential: string
  password: string
}

export interface TokenBody {
  token: string
}

export interface SignUpBody {
  email: string
  username: string
  password: string
  firstName?: string
  lastName?: string
  name?: string
  invitationToken?: string
}

export interface InvitationPayload {
  inviterId: bigint
  invitedEmail: string
}

export interface SignUpPayload {
  body: SignUpBody
  invitation?: InvitationPayload
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

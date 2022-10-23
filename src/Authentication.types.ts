export interface AuthenticationOptions {
  dynamicsLocation: string
  enableInvitations?: boolean
  enableLogInCount?: boolean
  enableMultiFactor?: boolean
  enforceMultiFactor?: boolean
  lockAfterMaxFailedAttempts?: boolean
  maxAttemptsUntilLock?: number
  unlockAfter?: string
}

export interface Authenticatable {
  id: bigint
  username: string
  email: string
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
  invitationToken: string
  inviterId: string
  save: () => Promise<Authenticatable>
}

export interface AuthenticatableClass {
  new (...args: any[]): Authenticatable
  findByCredential: (credential: string) => Promise<Authenticatable>
}

export interface DynamicPayload<B = Record<string, any>> {
  authOptions: AuthenticationOptions
  Authenticatable: AuthenticatableClass
  body: B
}

export interface AuthenticationResult {
  authenticatable?: Authenticatable
  message?: string
  state: 'success' | 'failure' | 'warning'
  // validation?: ValidationResult
}

export interface AuthDynamicNames {
  'authenticatable-by-credential': { payload: CredentialBody; result: Authenticatable }
  'does-authenticatable-requires-multi-factor?': { payload: AuthenticatableBody; result: boolean }
  'is-authenticatable-lockable?': { payload: AuthenticatableBody; result: boolean }
  'is-authenticatable-locked?': { payload: AuthenticatableBody; result: boolean }
  'is-authenticatable-password?': { payload: AuthenticatablePasswordBody; result: boolean }
  'is-authenticatable-ready-to-unlock?': { payload: AuthenticatableBody; result: boolean }
  'log-in': { payload: LogInBody; result: AuthenticationResult }
  'save-authenticatable': { payload: AuthenticatableBody; result: void }
  'set-authenticatable-fail-attempt': { payload: AuthenticatableBody; result: void }
  'set-authenticatable-locked': { payload: AuthenticatableBody; result: void }
  'set-authenticatable-log-in-count': { payload: AuthenticatableBody; result: void }
  'set-authenticatable-multi-factor': { payload: AuthenticatableBody; result: void }
  'set-authenticatable-unlocked': { payload: AuthenticatableBody; result: void }
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

export interface SignUpBody {
  email: string
  username: string
  password: string
  invitationToken?: string
}

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

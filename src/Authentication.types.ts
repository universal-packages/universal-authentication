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

  // guestId: string
  // appleId: string
  // facebookId: string
  // googleId: string

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

export interface AuthenticationResult {
  authenticatable?: Authenticatable
  message?: string
  state: 'success' | 'failure' | 'warning'
  // validation?: ValidationResult
}

export interface DynamicPayload<B = Record<string, any>> {
  authOptions: AuthenticationOptions
  Authenticatable: AuthenticatableClass
  body: B
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

export interface Customs {
  'check-password': (authenticatable: Authenticatable, password: string) => boolean
  'set-password': (authenticatable: Authenticatable, password: string) => Promise<void>
}

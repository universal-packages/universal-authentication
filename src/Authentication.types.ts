export type ExtensibleUnion<T extends U, U = string | number | symbol> = T | (U & { zz__ignore?: never })
export type CredentialKind = 'email' | 'phone'
export type AuthConcern = 'confirmation' | 'corroboration' | 'invitation' | 'log-in' | 'multi-factor' | 'password-reset' | 'sign-up' | 'unlock'
export interface AuthenticationOptions {
  debug?: boolean
  dynamicsLocation: string

  email?: AuthenticationCredentialOptions

  enableLocking?: boolean
  enableLogInCount?: boolean

  maxAttemptsUntilLock?: number

  multiFactorActivityLimit?: string

  phone?: AuthenticationCredentialOptions

  providerKeys?: { [provider: string]: Record<string, string> }

  secret: string

  unlockAfter?: string

  validations?: AttributesValidationOptions
}

export interface AuthenticationCredentialOptions {
  confirmationGracePeriod?: string

  enableConfirmation?: boolean
  enableCorroboration?: boolean
  enableMultiFactor?: boolean
  enablePasswordCheck?: boolean
  enableSignUp?: boolean
  enableSignUpInvitations?: boolean

  enforceConfirmation?: boolean
  enforceMultiFactor?: boolean
  enforcePasswordCheck?: boolean
  enforceSignUpInvitations?: boolean

  sendMultiFactorInPlace?: boolean
}

export interface AttributesValidationOptions {
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

  profilePictureUrl?: string

  email?: string
  emailConfirmedAt?: Date
  unconfirmedEmail?: string

  phone?: string
  phoneConfirmedAt?: Date
  unconfirmedPhone?: string

  username?: string

  failedLogInAttempts?: number
  lockedAt?: Date

  logInCount?: number

  multiFactorEnabled?: boolean
  multiFactorActiveAt?: Date

  password?: string
  encryptedPassword?: string

  firstName?: string
  lastName?: string
  name?: string

  inviterId?: number | bigint | string

  createdAt?: Date
  updatedAt?: Date

  save: () => Promise<Authenticatable>
}

export interface AssignableAttributes {
  email?: string
  username?: string
  phone?: string
  password?: string
  firstName?: string
  lastName?: string
  name?: string
  profilePictureUrl?: string
  multiFactorEnabled?: boolean
}

export interface AuthenticatableClass<A = Authenticatable> {
  new (...args: any[]): A
  existsWithCredential: (credentialKind: CredentialKind, credential: string) => Promise<boolean>
  existsWithUsername: (username: string) => Promise<boolean>
  findById: (id: string | number | bigint) => Promise<Authenticatable>
  findByCredential: (credential: string) => Promise<Authenticatable>
  findByProviderId: (provider: string, id: string | number | bigint) => Promise<Authenticatable>
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

export interface ProviderDataAttributes {
  id: string | number | bigint
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  name?: string
  profilePictureUrl?: string
}

export interface ProviderDataResult {
  attributes?: ProviderDataAttributes
  error?: Error
}

export interface GetProviderUserDataPayload {
  token: string
  keys: Record<string, string>
}

export interface Corroboration {
  credential: string
  credentialKind: CredentialKind
}

export interface Invitation {
  credential: string
  credentialKind: CredentialKind
  inviterId: string | number | bigint
}

export interface MultiFactorMetadata {
  identifier: string
  email?: string
  phone?: string
}

export interface SimplifiedAuthDynamicNames {
  'connect-provider': { payload: ConnectProviderPayload; result: AuthenticationResult }
  'continue-with-provider': { payload: ContinueWithProviderPayload; result: AuthenticationResult }
  'invite-authenticatable': { payload: InviteAuthenticatablePayload; result: AuthenticationResult }
  'log-in': { payload: LogInPayload; result: AuthenticationResult }
  'request-confirmation': { payload: RequestConfirmationPayload; result: AuthenticationResult }
  'request-corroboration': { payload: RequestCorroborationPayload; result: AuthenticationResult }
  'request-multi-factor': { payload: RequestMultiFactorPayload; result: AuthenticationResult }
  'request-password-reset': { payload: RequestPasswordResetPayload; result: AuthenticationResult }
  'request-unlock': { payload: RequestUnlockPayload; result: AuthenticationResult }
  'sign-up': { payload: SignUpPayload; result: AuthenticationResult }
  'update-authenticatable': { payload: UpdateAuthenticatablePayload; result: AuthenticationResult }
  'update-credential': { payload: UpdateCredentialPayload; result: AuthenticationResult }
  'verify-confirmation': { payload: VerifyConfirmationPayload; result: AuthenticationResult }
  'verify-corroboration': { payload: VerifyCorroborationPayload; result: AuthenticationResult }
  'verify-multi-factor': { payload: VerifyMultiFactorPayload; result: AuthenticationResult }
  'verify-password-reset': { payload: VerifyPasswordResetPayload; result: AuthenticationResult }
  'verify-unlock': { payload: VerifyUnlockPayload; result: AuthenticationResult }
  zz__ignore: { payload: Record<string, any>; result: any }
}

export interface ConnectProviderPayload {
  authenticatable: Authenticatable
  provider: string
  token: string
}

export interface ContinueWithProviderPayload {
  provider: string
  token: string
}

export interface InviteAuthenticatablePayload {
  credential: string
  credentialKind: CredentialKind
  inviterId: number | bigint | string
}

export interface LogInPayload {
  credential: string
  password?: string
}

export interface RequestConfirmationPayload {
  authenticatable?: Authenticatable
  credential?: string
  credentialKind: CredentialKind
}

export interface RequestCorroborationPayload {
  credential: string
  credentialKind: CredentialKind
}

export interface RequestMultiFactorPayload {
  identifier?: string
  credentialKind: CredentialKind
}

export interface RequestPasswordResetPayload {
  credential: string
  credentialKind: CredentialKind
}

export interface RequestUnlockPayload {
  authenticatable: Authenticatable
  credentialKind: CredentialKind
}

export interface SignUpPayload {
  attributes: AssignableAttributes
  credentialKind: CredentialKind
  corroborationToken?: string
  invitationToken?: string
}

export interface UpdateAuthenticatablePayload {
  attributes: AssignableAttributes
  authenticatable: Authenticatable
}

export interface UpdateCredentialPayload {
  authenticatable: Authenticatable
  corroborationToken?: string
  credential: string
  credentialKind: CredentialKind
}

export interface VerifyConfirmationPayload {
  credential: string
  credentialKind: CredentialKind
  oneTimePassword: string
}

export interface VerifyCorroborationPayload {
  credential: string
  credentialKind: CredentialKind
  oneTimePassword: string
}

export interface VerifyMultiFactorPayload {
  identifier: string
  oneTimePassword: string
}

export interface VerifyPasswordResetPayload {
  identifier: string
  oneTimePassword: string
  password: string
}

export interface VerifyUnlockPayload {
  identifier: string
  oneTimePassword: string
}

export interface AuthDynamicNames extends SimplifiedAuthDynamicNames {
  'authenticatable-from-credential': { payload: AuthenticatableFromCredentialPayload; result: Authenticatable }
  'authenticatable-from-id': { payload: AuthenticatableFromIdPayload; result: Authenticatable }
  'authenticatable-from-provider-id': { payload: AuthenticatableFromProviderIdPayload; result: Authenticatable }
  'authenticatable-from-provider-user-data': { payload: AuthenticatableFromProviderUserDataPayload; result: Authenticatable }
  'authenticatable-from-sign-up': { payload: AuthenticatableFromSignUpPayload; result: Authenticatable }
  'credential-kind-from-credential-authenticatable': { payload: CredentialKindFromCredentialAuthenticatablePayload; result: CredentialKind }
  'decrypt-corroboration-token': { payload: DecryptCorroborationTokenPayload; result: Invitation }
  'decrypt-invitation-token': { payload: DecryptInvitationTokenPayload; result: Invitation }
  'does-authenticatable-have-password?': { payload: DoesAuthenticatableHavePasswordPayload; result: boolean }
  'does-authenticatable-requires-multi-factor?': { payload: DoesAuthenticatableRequiresMultiFactorPayload; result: boolean }
  'encrypt-corroboration': { payload: EncryptCorroborationPayload; result: string }
  'encrypt-invitation': { payload: EncryptInvitationPayload; result: string }
  'generate-concern-secret': { payload: GenerateConcernSecretPayload; result: string }
  'generate-multi-factor-metadata': { payload: GenerateMultiFactorMetadataPayload; result: MultiFactorMetadata }
  'generate-one-time-password': { payload: GenerateOneTimePasswordPayload; result: string }
  'has-authenticatable-confirmation-passed-grace-period?': { payload: HasAuthenticatableConfirmationPassedGracePeriodPayload; result: boolean }
  'is-authenticatable-confirmed?': { payload: IsAuthenticatableConfirmedPayload; result: boolean }
  'is-authenticatable-connected?': { payload: IsAuthenticatableConnectedPayload; result: boolean }
  'is-authenticatable-lockable?': { payload: IsAuthenticatableLockablePayload; result: boolean }
  'is-authenticatable-locked?': { payload: IsAuthenticatableLockedPayload; result: boolean }
  'is-authenticatable-multi-factor-active?': { payload: IsAuthenticatableMultiFactorActivePayload; result: boolean }
  'is-authenticatable-password?': { payload: IsAuthenticatablePasswordPayload; result: boolean }
  'is-authenticatable-ready-to-unlock?': { payload: IsAuthenticatableReadyToUnlockPayload; result: boolean }
  'save-authenticatable': { payload: SaveAuthenticatablePayload; result: void }
  'send-confirmation': { payload: SendConfirmationPayload; result: void }
  'send-corroboration': { payload: SendCorroborationPayload; result: void }
  'send-invitation': { payload: SendInvitationPayload; result: void }
  'send-multi-factor': { payload: SendMultiFactorPayload; result: void }
  'send-password-reset': { payload: SendPasswordResetPayload; result: void }
  'send-unlock': { payload: SendUnlockPayload; result: void }
  'set-authenticatable-attributes': { payload: SetAuthenticatableAttributesPayload; result: void }
  'set-authenticatable-confirmed': { payload: SetAuthenticatableConfirmedPayload; result: void }
  'set-authenticatable-fail-attempt': { payload: SetAuthenticatableFailAttemptPayload; result: void }
  'set-authenticatable-locked': { payload: SetAuthenticatableLockedPayload; result: void }
  'set-authenticatable-log-in-count': { payload: SetAuthenticatableLogInCountPayload; result: void }
  'set-authenticatable-multi-factor-active': { payload: SetAuthenticatableMultiFactorActivePayload; result: void }
  'set-authenticatable-multi-factor-inactive': { payload: SetAuthenticatableMultiFactorInactivePayload; result: void }
  'set-authenticatable-password': { payload: SetAuthenticatablePasswordPayload; result: void }
  'set-authenticatable-profile-picture': { payload: SetAuthenticatableProfilePicturePayload; result: void }
  'set-authenticatable-provider-id': { payload: SetAuthenticatableProviderIdPayload; result: void }
  'set-authenticatable-unconfirmed-credential': { payload: SetAuthenticatableUnconfirmedCredentialPayload; result: void }
  'set-authenticatable-unlocked': { payload: SetAuthenticatableUnlockedPayload; result: void }
  'stablish-authenticatable-unconfirmed-credential': { payload: StablishAuthenticatableUnconfirmedCredentialPayload; result: void }
  'validate-attributes': { payload: ValidateAttributesPayload; result: ValidationResult }
  'verify-one-time-password': { payload: VerifyOneTimePasswordPayload; result: boolean }
}

export interface AuthenticatableFromCredentialPayload {
  credential: string
}

export interface AuthenticatableFromIdPayload {
  id: string | number | bigint
}

export interface AuthenticatableFromProviderIdPayload {
  provider: string
  id: string | number | bigint
}

export interface AuthenticatableFromProviderUserDataPayload {
  provider: string
  attributes: ProviderDataAttributes
}

export interface AuthenticatableFromSignUpPayload {
  attributes: AssignableAttributes
  credentialKind: CredentialKind
  corroboration?: Corroboration
  invitation?: Invitation
}

export interface CredentialKindFromCredentialAuthenticatablePayload {
  authenticatable?: Authenticatable
  credential?: string
}

export interface DecryptCorroborationTokenPayload {
  token: string
}

export interface DecryptInvitationTokenPayload {
  token: string
}

export interface DoesAuthenticatableHavePasswordPayload {
  authenticatable: Authenticatable
}

export interface DoesAuthenticatableRequiresMultiFactorPayload {
  authenticatable: Authenticatable
}

export interface EncryptCorroborationPayload {
  corroboration: Corroboration
}

export interface EncryptInvitationPayload {
  invitation: Invitation
}

export interface GenerateConcernSecretPayload {
  concern: AuthConcern
  identifier: string
}

export interface GenerateMultiFactorMetadataPayload {
  authenticatable: Authenticatable
}

export interface GenerateOneTimePasswordPayload {
  concern: AuthConcern
  identifier: string
}

export interface HasAuthenticatableConfirmationPassedGracePeriodPayload {
  authenticatable: Authenticatable
  credentialKind: CredentialKind
}

export interface IsAuthenticatableConfirmedPayload {
  authenticatable: Authenticatable
  credentialKind: CredentialKind
}

export interface IsAuthenticatableConnectedPayload {
  authenticatable: Authenticatable
  provider: string
}

export interface IsAuthenticatableLockablePayload {
  authenticatable: Authenticatable
}

export interface IsAuthenticatableLockedPayload {
  authenticatable: Authenticatable
}

export interface IsAuthenticatableMultiFactorActivePayload {
  authenticatable: Authenticatable
}

export interface IsAuthenticatablePasswordPayload {
  authenticatable: Authenticatable
  password: string
}

export interface IsAuthenticatableReadyToUnlockPayload {
  authenticatable: Authenticatable
}

export interface SaveAuthenticatablePayload {
  authenticatable: Authenticatable
}

export interface SendConfirmationPayload {
  credential: string
  credentialKind: CredentialKind
  oneTimePassword: string
}

export interface SendCorroborationPayload {
  credential: string
  credentialKind: CredentialKind
  oneTimePassword: string
}

export interface SendInvitationPayload {
  credential: string
  credentialKind: CredentialKind
  invitationToken: string
}

export interface SendMultiFactorPayload {
  credential: string
  credentialKind: CredentialKind
  identifier: string
  oneTimePassword: string
}

export interface SendPasswordResetPayload {
  credential: string
  credentialKind: CredentialKind
  identifier: string
  oneTimePassword: string
}

export interface SendUnlockPayload {
  credential: string
  credentialKind: CredentialKind
  oneTimePassword: string
}

export interface SetAuthenticatableAttributesPayload {
  authenticatable: Authenticatable
  attributes: AssignableAttributes
  include?: (keyof AssignableAttributes)[]
  exclude?: (keyof AssignableAttributes)[]
}

export interface SetAuthenticatableConfirmedPayload {
  authenticatable: Authenticatable
  credentialKind: CredentialKind
}

export interface SetAuthenticatableFailAttemptPayload {
  authenticatable: Authenticatable
}

export interface SetAuthenticatableLockedPayload {
  authenticatable: Authenticatable
}

export interface SetAuthenticatableLogInCountPayload {
  authenticatable: Authenticatable
}

export interface SetAuthenticatableMultiFactorActivePayload {
  authenticatable: Authenticatable
}

export interface SetAuthenticatableMultiFactorInactivePayload {
  authenticatable: Authenticatable
}

export interface SetAuthenticatablePasswordPayload {
  authenticatable: Authenticatable
  password: string
}

export interface SetAuthenticatableProfilePicturePayload {
  authenticatable: Authenticatable
  pictureUrl: string
}

export interface SetAuthenticatableProviderIdPayload {
  authenticatable: Authenticatable
  provider: string
  id: string | number | bigint
}

export interface SetAuthenticatableUnconfirmedCredentialPayload {
  authenticatable: Authenticatable
  credential: string
  credentialKind: CredentialKind
}

export interface SetAuthenticatableUnlockedPayload {
  authenticatable: Authenticatable
}

export interface StablishAuthenticatableUnconfirmedCredentialPayload {
  authenticatable: Authenticatable
  credentialKind: CredentialKind
}

export interface ValidateAttributesPayload {
  attributes: AssignableAttributes
  include?: (keyof AttributesValidationOptions)[]
  exclude?: (keyof AttributesValidationOptions)[]
  allOptional?: boolean
}

export interface VerifyOneTimePasswordPayload {
  concern: AuthConcern
  identifier: string
  oneTimePassword: string
}

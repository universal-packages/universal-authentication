import { Authenticatable, CredentialKind, Encrypt } from '../../src'

export default class TestAuthenticatable implements Authenticatable {
  public static lastInstance: TestAuthenticatable

  public static readonly findByCredential = jest.fn().mockImplementation((credential: string): TestAuthenticatable => {
    const instance = new TestAuthenticatable()

    instance.password = 'password'
    instance.createdAt = new Date(new Date().getTime() - 10000)

    const credentialKind: CredentialKind = credential.split('-')[0] as any
    instance[credentialKind] = credential

    const directive = credential.split('-').splice(1).join('-')

    switch (directive) {
      case 'about-to-lock':
        instance.failedLogInAttempts = 2
        break

      case 'nop':
        return

      case 'confirmed':
        instance[`${credentialKind}ConfirmedAt`] = new Date()
        break

      case 'locked':
        instance.failedLogInAttempts = 3
        instance.lockedAt = new Date()
        break

      case 'multi-factor-enabled':
        instance.multiFactorEnabled = true
        break

      case 'ready-to-unlock':
        instance.failedLogInAttempts = 5
        instance.lockedAt = new Date(new Date().getTime() - 10000)
        break

      case 'unconfirmed':
        instance[`${credentialKind}ConfirmedAt`] = null
        break
    }

    return instance
  })

  public static readonly existsWithCredential = jest.fn().mockImplementation((credentialKind: string, credential: string): boolean => {
    switch (credentialKind) {
      default:
    }

    return false
  })

  public static readonly existsWithUsername = jest.fn().mockImplementation((username: string): boolean => {
    switch (username) {
      default:
    }

    return false
  })

  public constructor() {
    TestAuthenticatable.lastInstance = this
  }

  id: number = 69

  email?: string = null
  emailConfirmedAt?: Date = null

  phone?: string = null
  phoneConfirmedAt?: Date = null

  username?: string = null

  failedLogInAttempts?: number = 0
  lockedAt?: Date = null
  logInCount?: number = 0

  multiFactorEnabled?: boolean = null
  multiFactorActive?: boolean = null

  @Encrypt()
  password?: string
  encryptedPassword?: string = null

  firstName?: string = null
  lastName?: string = null
  name?: string = null

  inviterId?: number = null

  createdAt?: Date = null

  public readonly save = jest.fn().mockImplementation(() => {
    if (!this.createdAt) this.createdAt = new Date()
  })
}

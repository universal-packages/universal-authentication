import { Encrypt } from '../../src'

export default class TestAuthenticatable {
  public static lastInstance: TestAuthenticatable

  public static readonly findByCredential = jest.fn().mockImplementation((credential: string): TestAuthenticatable => {
    const instance = new TestAuthenticatable()

    switch (credential) {
      case '<about-to-lock>':
        instance.failedLogInAttempts = 4
        break
      case '<locked>':
        instance.lockedAt = new Date(new Date().getTime() + 10000)
        instance.unlockToken = 'unlock-me'
        instance.failedLogInAttempts = 5
        break
      case '<locked-ready>':
        instance.lockedAt = new Date(new Date().getTime() - 10000)
        instance.unlockToken = 'unlock-me'
        instance.failedLogInAttempts = 5
        break
      case '<multi-factor>':
        instance.multiFactorEnabled = true
        break
      default:
    }

    return instance
  })

  public constructor() {
    TestAuthenticatable.lastInstance = this
  }

  public id: bigint = 69n
  public username: string = 'universal'
  public email = 'omarandstuff@gmail.com'
  public profilePictureUrl: string
  public firstName: string = 'David'
  public lastName: string = 'De Anda'
  @Encrypt()
  public password: string = 'secret'
  public encryptedPassword: string
  public multiFactorEnabled: boolean = false
  public multiFactorToken: string
  public locale: string = 'esMX'
  public resetPasswordToken: string
  public logInCount: number = 0
  public confirmationToken: string
  public confirmedAt: Date
  public failedLogInAttempts: number = 0
  public unlockToken: string
  public lockedAt: Date
  public invitationToken: string
  public inviterId: string

  public readonly save = jest.fn()
}

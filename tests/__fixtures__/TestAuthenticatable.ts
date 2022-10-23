import { Authenticatable, Encrypt } from '../../src'

export default class TestAuthenticatable implements Authenticatable {
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
      case '<unconfirmed>':
        instance.confirmationToken = 'confirm-me'
        instance.confirmedAt = null
        break
      default:
    }

    return instance
  })

  public static readonly existsWithEmail = jest.fn().mockImplementation((email: string): boolean => {
    switch (email) {
      default:
    }

    return true
  })

  public static readonly existsWithUsername = jest.fn().mockImplementation((username: string): boolean => {
    switch (username) {
      default:
    }

    return true
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
  public name: string = 'David De Anda'
  @Encrypt()
  public password: string = 'secret'
  public encryptedPassword: string
  public multiFactorEnabled: boolean = false
  public multiFactorToken: string
  public locale: string = 'esMX'
  public resetPasswordToken: string
  public logInCount: number = 0
  public confirmationToken: string
  public confirmedAt: Date = new Date()
  public failedLogInAttempts: number = 0
  public unlockToken: string
  public lockedAt: Date
  public inviterId: bigint

  public readonly save = jest.fn()
}

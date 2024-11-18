import { Authentication, DefaultModuleDynamicNames } from '../../src'
import UpdateUserDynamic from '../../src/UpdateUser.universal-auth-dynamic'
import VerifyOneTimePasswordDynamic from '../../src/VerifyOneTimePassword.universal-auth-dynamic'
import SendPasswordWasResetDynamic from '../../src/default-module/SendPasswordWasReset.universal-auth-dynamic'
import UserFromEmailDynamic from '../../src/default-module/UserFromEmail.universal-auth-dynamic'
import VerifyPasswordResetDynamic from '../../src/default-module/VerifyPasswordReset.universal-auth-dynamic'

describe(Authentication, (): void => {
  describe(VerifyPasswordResetDynamic, (): void => {
    describe('when one time password works to reset password', (): void => {
      it('returns success', async (): Promise<void> => {
        const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        dynamicApiJest.mockDynamicReturnValue(VerifyOneTimePasswordDynamic, true)

        const user = { id: 1, email: 'david@universal-packages.com' }
        dynamicApiJest.mockDynamicReturnValue(UserFromEmailDynamic, user)

        const result = await authentication.performDynamic('verify-password-reset', {
          email: 'david@universal-packages.com',
          oneTimePassword: '123',
          password: 'new-password'
        })

        expect(result).toEqual({ status: 'success', user })
        expect(UpdateUserDynamic).toHaveBeenPerformedWith({ user, attributes: { encryptedPassword: expect.any(String) } })
        expect(SendPasswordWasResetDynamic).toHaveBeenPerformedWith({ user })
      })
    })

    describe('when one time password does not work to reset password', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const result = await authentication.performDynamic('verify-password-reset', {
          email: 'david@universal-packages.com',
          oneTimePassword: '123',
          password: 'password'
        })

        expect(result).toEqual({ status: 'failure', message: 'invalid-one-time-password' })
        expect(UpdateUserDynamic).not.toHaveBeenPerformed()
        expect(SendPasswordWasResetDynamic).not.toHaveBeenPerformed()
      })
    })

    describe('when user does not exist', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        dynamicApiJest.mockDynamicReturnValue(VerifyOneTimePasswordDynamic, true)
        dynamicApiJest.mockDynamicReturnValue(UserFromEmailDynamic, null)

        const result = await authentication.performDynamic('verify-password-reset', {
          email: 'invalid@universal-packages.com',
          oneTimePassword: '123',
          password: 'password'
        })

        expect(result).toEqual({ status: 'failure', message: 'nothing-to-do' })
        expect(UpdateUserDynamic).not.toHaveBeenPerformed()
        expect(SendPasswordWasResetDynamic).not.toHaveBeenPerformed()
      })
    })

    describe('when password is invalid', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        dynamicApiJest.mockDynamicReturnValue(VerifyOneTimePasswordDynamic, true)
        const user = { id: 1, email: 'david@universal-packages.com' }
        dynamicApiJest.mockDynamicReturnValue(UserFromEmailDynamic, user)

        const result = await authentication.performDynamic('verify-password-reset', {
          email: 'david@universal-packages.com',
          oneTimePassword: '123',
          password: 'short'
        })

        expect(result).toEqual({ status: 'failure', validation: { valid: false, errors: { password: ['password-out-of-size'] } } })
      })
    })
  })
})

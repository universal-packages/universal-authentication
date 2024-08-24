import { Authentication } from '../../src'
import SaveAuthenticatableDynamic from '../../src/SaveAuthenticatable.universal-auth-dynamic'
import VerifyOneTimePasswordDynamic from '../../src/VerifyOneTimePassword.universal-auth-dynamic'
import SendPasswordWasResetDynamic from '../../src/default-module/SendPasswordWasReset.universal-auth-dynamic'
import SetAuthenticatablePasswordDynamic from '../../src/default-module/SetAuthenticatablePassword.universal-auth-dynamic'
import VerifyPasswordResetDynamic from '../../src/default-module/VerifyPasswordReset.universal-auth-dynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe(Authentication, (): void => {
  describe(VerifyPasswordResetDynamic, (): void => {
    describe('when one time password works to reset password', (): void => {
      it('returns success', async (): Promise<void> => {
        const authentication = new Authentication({ dynamicsLocation: './src', secret: '123' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        dynamicApiJest.mockDynamicReturnValue(VerifyOneTimePasswordDynamic, true)

        const result = await authentication.performDynamic('verify-password-reset', {
          email: 'david@universal-packages.com',
          oneTimePassword: '123',
          password: 'password'
        })

        expect(result).toEqual({ status: 'success', authenticatable: TestAuthenticatable.lastInstance })
        expect(SetAuthenticatablePasswordDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance, password: 'password' })
        expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
        expect(SendPasswordWasResetDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
      })
    })

    describe('when one time password does not work to reset password', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication({ dynamicsLocation: './src', secret: '123' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const result = await authentication.performDynamic('verify-password-reset', {
          email: 'david@universal-packages.com',
          oneTimePassword: '123',
          password: 'password'
        })

        expect(result).toEqual({ status: 'failure', message: 'invalid-one-time-password' })
        expect(SetAuthenticatablePasswordDynamic).not.toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance, password: 'password' })
        expect(SaveAuthenticatableDynamic).not.toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
        expect(SendPasswordWasResetDynamic).not.toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
      })
    })

    describe('when authenticatable does not exist', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication({ dynamicsLocation: './src', secret: '123' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        dynamicApiJest.mockDynamicReturnValue(VerifyOneTimePasswordDynamic, true)

        const result = await authentication.performDynamic('verify-password-reset', {
          email: 'invalid@universal-packages.com',
          oneTimePassword: '123',
          password: 'password'
        })

        expect(result).toEqual({ status: 'failure', message: 'nothing-to-do' })
        expect(SetAuthenticatablePasswordDynamic).not.toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance, password: 'password' })
        expect(SaveAuthenticatableDynamic).not.toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
        expect(SendPasswordWasResetDynamic).not.toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
      })
    })

    describe('when password is invalid', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication({ dynamicsLocation: './src', secret: '123' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        dynamicApiJest.mockDynamicReturnValue(VerifyOneTimePasswordDynamic, true)

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

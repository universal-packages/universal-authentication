import { Authentication } from '../../src'
import SaveAuthenticatableDynamic from '../../src/SaveAuthenticatable.universal-auth-dynamic'
import SendWelcomeDynamic from '../../src/default-module/SendWelcome.universal-auth-dynamic'
import SignUpDynamic from '../../src/default-module/SignUp.universal-auth-dynamic'
import AfterSignUpFailureDynamic from '../../src/default-module/extensions/AfterSignUpFailure.universal-auth-dynamic'
import AfterSignUpSuccessDynamic from '../../src/default-module/extensions/AfterSignUpSuccess.universal-auth-dynamic'
import ContinueBeforeSignUpDynamic from '../../src/default-module/extensions/ContinueBeforeSignUp.universal-auth-dynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe(Authentication, (): void => {
  describe(SignUpDynamic, (): void => {
    describe('when the right signup attributes are passed', (): void => {
      it('returns success', async (): Promise<void> => {
        const authentication = new Authentication({ dynamicsLocation: './src', secret: '123' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const result = await authentication.performDynamic('sign-up', { email: 'david@universal-packages.com', password: 'password' })

        expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
        expect(TestAuthenticatable.lastInstance).toMatchObject({
          email: 'david@universal-packages.com',
          password: 'password'
        })
        expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
        expect(SendWelcomeDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
        expect(ContinueBeforeSignUpDynamic).toHaveBeenPerformedWith({ email: 'david@universal-packages.com', password: 'password' })
        expect(AfterSignUpSuccessDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
      })
    })

    describe('when the signup attributes are invalid', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication({ dynamicsLocation: './src', secret: '123' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const result = await authentication.performDynamic('sign-up', { email: 'david', password: 'wow' })

        expect(result).toEqual({
          status: 'failure',
          validation: {
            errors: {
              email: ['invalid-email'],
              password: ['password-out-of-size']
            },
            valid: false
          }
        })
        expect(SaveAuthenticatableDynamic).not.toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
        expect(SendWelcomeDynamic).not.toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
        expect(ContinueBeforeSignUpDynamic).toHaveBeenPerformedWith({ email: 'david', password: 'wow' })
        expect(AfterSignUpFailureDynamic).toHaveBeenPerformedWith({
          email: 'david',
          password: 'wow',
          validation: {
            errors: {
              email: ['invalid-email'],
              password: ['password-out-of-size']
            },
            valid: false
          }
        })
      })
    })

    describe('when sign up should not continue', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication({ dynamicsLocation: './src', secret: '123' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        dynamicApiJest.mockDynamicReturnValue(ContinueBeforeSignUpDynamic, false)

        const result = await authentication.performDynamic('sign-up', { email: 'david@universal-packages.com', password: 'password' })

        expect(result).toEqual({ status: 'failure', message: 'sign-up-not-allowed' })
        expect(ContinueBeforeSignUpDynamic).toHaveBeenPerformedWith({ email: 'david@universal-packages.com', password: 'password' })
      })
    })
  })
})

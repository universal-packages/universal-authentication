import { Authentication, DefaultModuleDynamicNames } from '../../src'
import CreateUserDynamic from '../../src/CreateUser.universal-auth-dynamic'
import SendWelcomeDynamic from '../../src/default-module/SendWelcome.universal-auth-dynamic'
import SignUpDynamic from '../../src/default-module/SignUp.universal-auth-dynamic'
import AfterSignUpFailureDynamic from '../../src/default-module/extensions/AfterSignUpFailure.universal-auth-dynamic'
import AfterSignUpSuccessDynamic from '../../src/default-module/extensions/AfterSignUpSuccess.universal-auth-dynamic'
import ContinueBeforeSignUpDynamic from '../../src/default-module/extensions/ContinueBeforeSignUp.universal-auth-dynamic'

describe(Authentication, (): void => {
  describe(SignUpDynamic, (): void => {
    describe('when the right signup attributes are passed', (): void => {
      it('returns success', async (): Promise<void> => {
        const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const user = { email: 'david@universal-packages.com', password: 'password' }
        dynamicApiJest.mockDynamicReturnValue(CreateUserDynamic, user)

        const result = await authentication.performDynamic('sign-up', { email: 'david@universal-packages.com', password: 'password' })

        expect(result).toEqual({ status: 'success', user })
        expect(CreateUserDynamic).toHaveBeenPerformedWith({ attributes: { email: 'david@universal-packages.com', encryptedPassword: expect.any(String) } })
        expect(SendWelcomeDynamic).toHaveBeenPerformedWith({ user })
        expect(ContinueBeforeSignUpDynamic).toHaveBeenPerformedWith({ email: 'david@universal-packages.com', password: 'password' })
        expect(AfterSignUpSuccessDynamic).toHaveBeenPerformedWith({ user })
      })
    })

    describe('when the signup attributes are invalid', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
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
        expect(CreateUserDynamic).not.toHaveBeenPerformed()
        expect(SendWelcomeDynamic).not.toHaveBeenPerformed()
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
        const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
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

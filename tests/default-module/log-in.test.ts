import { Authentication } from '../../src'
import LogInDynamic from '../../src/default-module/LogIn.universal-auth-dynamic'
import AfterLogInAuthenticatableNotFoundDynamic from '../../src/default-module/extensions/AfterLogInAuthenticatableNotFound.universal-auth-dynamic'
import AfterLogInFailureDynamic from '../../src/default-module/extensions/AfterLogInFailure.universal-auth-dynamic'
import AfterLogInSuccessDynamic from '../../src/default-module/extensions/AfterLogInSuccess.universal-auth-dynamic'
import ContinueAfterAuthenticatableFoundDynamic from '../../src/default-module/extensions/ContinueAfterLogInAuthenticatableFound.universal-auth-dynamic'
import ContinueBeforeLogInDynamic from '../../src/default-module/extensions/ContinueBeforeLogIn.universal-auth-dynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe(Authentication, (): void => {
  describe(LogInDynamic, (): void => {
    describe('when the right email and password are provided', (): void => {
      it('returns success', async (): Promise<void> => {
        const authentication = new Authentication({ dynamicsLocation: './src', secret: '123' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const result = await authentication.performDynamic('log-in', { email: 'david@universal-packages.com', password: 'password' })

        expect(result).toEqual({ status: 'success', authenticatable: TestAuthenticatable.lastInstance })
        expect(ContinueBeforeLogInDynamic).toHaveBeenPerformedWith({ email: 'david@universal-packages.com', password: 'password' })
        expect(ContinueAfterAuthenticatableFoundDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
        expect(AfterLogInSuccessDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
      })
    })

    describe('when no authenticatable can be found by the email', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication({ dynamicsLocation: './src', secret: '123' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const result = await authentication.performDynamic('log-in', { email: 'invalid@universal-packages.com', password: 'password' })

        expect(result).toEqual({ status: 'failure', message: 'invalid-credentials' })
        expect(ContinueBeforeLogInDynamic).toHaveBeenPerformedWith({ email: 'invalid@universal-packages.com', password: 'password' })
        expect(AfterLogInAuthenticatableNotFoundDynamic).toHaveBeenPerformedWith({ email: 'invalid@universal-packages.com' })
      })
    })

    describe('when the password do not match', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication({ dynamicsLocation: './src', secret: '123' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const result = await authentication.performDynamic('log-in', { email: 'david@universal-packages.com', password: 'incorrect' })

        expect(result).toEqual({ status: 'failure', message: 'invalid-credentials' })
        expect(ContinueBeforeLogInDynamic).toHaveBeenPerformedWith({ email: 'david@universal-packages.com', password: 'incorrect' })
        expect(ContinueAfterAuthenticatableFoundDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
        expect(AfterLogInFailureDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
      })
    })

    describe('when log in should not continue', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication({ dynamicsLocation: './src', secret: '123' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        dynamicApiJest.mockDynamicReturnValue(ContinueBeforeLogInDynamic, false)

        const result = await authentication.performDynamic('log-in', { email: 'david@universal-packages.com', password: 'password' })

        expect(result).toEqual({ status: 'failure', message: 'log-in-not-allowed' })
        expect(ContinueBeforeLogInDynamic).toHaveBeenPerformedWith({ email: 'david@universal-packages.com', password: 'password' })
      })
    })

    describe('when log in should not continue after authenticatable found', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication({ dynamicsLocation: './src', secret: '123' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        dynamicApiJest.mockDynamicReturnValue(ContinueAfterAuthenticatableFoundDynamic, false)

        const result = await authentication.performDynamic('log-in', { email: 'david@universal-packages.com', password: 'password' })

        expect(result).toEqual({ status: 'failure', message: 'log-in-not-allowed' })
        expect(ContinueBeforeLogInDynamic).toHaveBeenPerformedWith({ email: 'david@universal-packages.com', password: 'password' })
        expect(ContinueAfterAuthenticatableFoundDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
      })
    })
  })
})

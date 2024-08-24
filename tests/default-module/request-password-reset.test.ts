import { Authentication } from '../../src'
import RequestPasswordResetDynamic from '../../src/default-module/RequestPasswordReset.universal-auth-dynamic'
import SendPasswordResetDynamic from '../../src/default-module/SendPasswordReset.universal-auth-dynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe(Authentication, (): void => {
  describe(RequestPasswordResetDynamic, (): void => {
    describe('when an authenticatable exists to be reset', (): void => {
      it('returns success', async (): Promise<void> => {
        const authentication = new Authentication({ dynamicsLocation: './src', secret: '123' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const result = await authentication.performDynamic('request-password-reset', { email: 'david@universal-packages.com' })

        expect(result).toEqual({ status: 'success' })
        expect(TestAuthenticatable.lastInstance).toMatchObject({ email: 'david@universal-packages.com', password: 'password' })
        expect(SendPasswordResetDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance, oneTimePassword: expect.any(String) })
      })
    })

    describe('when an authenticatable does not exist to be reset', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication({ dynamicsLocation: './src', secret: '123' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const result = await authentication.performDynamic('request-password-reset', { email: 'invalid@yes.com' })

        expect(result).toEqual({ status: 'warning', message: 'nothing-to-do' })
        expect(TestAuthenticatable.lastInstance).toBeUndefined()
        expect(SendPasswordResetDynamic).not.toHaveBeenPerformed()
      })
    })
  })
})

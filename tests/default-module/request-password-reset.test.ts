import { Authentication, DefaultModuleDynamicNames } from '../../src'
import RequestPasswordResetDynamic from '../../src/default-module/RequestPasswordReset.universal-auth-dynamic'
import SendPasswordResetDynamic from '../../src/default-module/SendPasswordReset.universal-auth-dynamic'
import UserFromEmailDynamic from '../../src/default-module/UserFromEmail.universal-auth-dynamic'

describe(Authentication, (): void => {
  describe(RequestPasswordResetDynamic, (): void => {
    describe('when an authenticatable exists to be reset', (): void => {
      it('returns success', async (): Promise<void> => {
        const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const user = { id: 1, email: 'david@universal-packages.com' }
        dynamicApiJest.mockDynamicReturnValue(UserFromEmailDynamic, user)

        const result = await authentication.performDynamic('request-password-reset', { email: 'david@universal-packages.com' })

        expect(result).toEqual({ status: 'success' })
        expect(UserFromEmailDynamic).toHaveBeenPerformedWith({ email: 'david@universal-packages.com' })
        expect(SendPasswordResetDynamic).toHaveBeenPerformedWith({ user, oneTimePassword: expect.any(String) })
      })
    })

    describe('when an authenticatable does not exist to be reset', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        dynamicApiJest.mockDynamicReturnValue(UserFromEmailDynamic, null)

        const result = await authentication.performDynamic('request-password-reset', { email: 'invalid@yes.com' })

        expect(result).toEqual({ status: 'warning', message: 'nothing-to-do' })
        expect(UserFromEmailDynamic).toHaveBeenPerformedWith({ email: 'invalid@yes.com' })
        expect(SendPasswordResetDynamic).not.toHaveBeenPerformed()
      })
    })
  })
})

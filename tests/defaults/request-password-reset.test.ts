import { Authentication } from '../../src'
import SendPasswordResetDynamic from '../../src/defaults/extended/SendPasswordReset.universal-auth-dynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe(Authentication, (): void => {
  describe('request-password-reset', (): void => {
    describe('when the credential is valid to reset', (): void => {
      it('returns success', async (): Promise<void> => {
        const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const result = await authentication.performDynamic('request-password-reset', { credential: 'any' })

        expect(result).toEqual({ status: 'success' })
        expect(SendPasswordResetDynamic).toHaveBeenPerformedWith({ credential: 'any', oneTimePassword: expect.any(String) })
      })
    })

    describe('and the credential is not valid', (): void => {
      it('returns success', async (): Promise<void> => {
        const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const result = await authentication.performDynamic('request-password-reset', { credential: 'any.nothing' })

        expect(result).toEqual({ status: 'warning', message: 'nothing-to-do' })
        expect(SendPasswordResetDynamic).not.toHaveBeenPerformed()
      })
    })
  })
})

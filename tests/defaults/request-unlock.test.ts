import { Authentication } from '../../src'
import SendResetUnlockDynamic from '../../src/defaults/extended/SendUnlock.universal-auth-dynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe(Authentication, (): void => {
  describe('request-unlock', (): void => {
    describe('when authenticatable is locked', (): void => {
      it('returns success', async (): Promise<void> => {
        const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const result = await authentication.performDynamic('request-unlock', { credential: 'any.locked' })

        expect(result).toEqual({ status: 'success' })
        expect(SendResetUnlockDynamic).toHaveBeenPerformedWith({ credential: 'any.locked', oneTimePassword: expect.any(String) })
      })
    })

    describe('when authenticatable is noy locked', (): void => {
      it('returns waring', async (): Promise<void> => {
        const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const result = await authentication.performDynamic('request-unlock', { credential: 'any' })

        expect(result).toEqual({ status: 'warning', message: 'nothing-to-do' })
        expect(SendResetUnlockDynamic).not.toHaveBeenPerformed()
      })
    })

    describe('when the credential is not valid', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const result = await authentication.performDynamic('request-unlock', { credential: 'any.nothing' })

        expect(result).toEqual({ status: 'warning', message: 'nothing-to-do' })
        expect(SendResetUnlockDynamic).not.toHaveBeenPerformed()
      })
    })
  })
})

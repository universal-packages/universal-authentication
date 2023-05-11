import { Authentication } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe('Authentication', (): void => {
  describe('default-dynamics', (): void => {
    describe('verify-unlock', (): void => {
      describe('when the one time password is valid', (): void => {
        it('returns success', async (): Promise<void> => {
          const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'unlock', identifier: '666' })

          const result = await authentication.performDynamic('verify-unlock', { credential: '666', oneTimePassword })

          expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
          expect(TestAuthenticatable.lastInstance.lockedAt).toEqual(null)
          expect(TestAuthenticatable.lastInstance.failedLogInAttempts).toEqual(0)
          expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
        })
      })

      describe('when the one time password is not valid', (): void => {
        it('returns failure', async (): Promise<void> => {
          const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          const result = await authentication.performDynamic('verify-unlock', { credential: '666', oneTimePassword: 'nop' })

          expect(result).toEqual({ status: 'failure', message: 'invalid-one-time-password' })
        })
      })
    })
  })
})

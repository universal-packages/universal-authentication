import { Authentication } from '../../src'
import SendMultiFactorDynamic from '../../src/defaults/extended/SendMultiFactor.universal-auth-dynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe('Authentication', (): void => {
  describe('default-dynamics', (): void => {
    describe('request-multi-factor', (): void => {
      describe('when authenticatable has multi-factor active (it has log in successfully)', (): void => {
        it('returns success', async (): Promise<void> => {
          const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          const result = await authentication.performDynamic('request-multi-factor', { credential: 'any.multi-factor-active' })

          expect(result).toEqual({ status: 'success' })
          expect(SendMultiFactorDynamic).toHaveBeenPerformedWith({ credential: 'any.multi-factor-active', oneTimePassword: expect.any(String) })
        })
      })

      describe('when authenticatable has multi-factor inactive', (): void => {
        it('returns waring', async (): Promise<void> => {
          const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          const result = await authentication.performDynamic('request-multi-factor', { credential: 'any.multi-factor-inactive' })

          expect(result).toEqual({ status: 'warning', message: 'nothing-to-do' })
          expect(SendMultiFactorDynamic).not.toHaveBeenPerformed()
        })
      })

      describe('when the credential is not valid', (): void => {
        it('returns failure', async (): Promise<void> => {
          const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          const result = await authentication.performDynamic('request-multi-factor', { credential: 'any.nothing' })

          expect(result).toEqual({ status: 'warning', message: 'nothing-to-do' })
          expect(SendMultiFactorDynamic).not.toHaveBeenPerformed()
        })
      })
    })
  })
})

import { Authentication } from '../../src'
import SaveAuthenticatableDynamic from '../../src/defaults/extended/SaveAuthenticatable.universal-auth-dynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe(Authentication, (): void => {
  describe('verify-multi-factor', (): void => {
    describe('when the one time password is valid', (): void => {
      describe('and the authenticatable multi factor is active', (): void => {
        it('returns success', async (): Promise<void> => {
          const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'multi-factor', identifier: 'any.multi-factor-active' })

          const result = await authentication.performDynamic('verify-multi-factor', { credential: 'any.multi-factor-active', oneTimePassword })

          expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
          expect(TestAuthenticatable.lastInstance.multiFactorActiveAt).toBeNull()
          expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
        })

        describe('and log in count is enabled', (): void => {
          it('sets the authenticatable login count', async (): Promise<void> => {
            const authentication = new Authentication({ enableLogInCount: true, secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
            authentication.options['namespace'] = 'universal-auth'
            await authentication.loadDynamics()

            const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'multi-factor', identifier: 'any.multi-factor-active' })

            const result = await authentication.performDynamic('verify-multi-factor', { credential: 'any.multi-factor-active', oneTimePassword })

            expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
            expect(result.authenticatable.logInCount).toEqual(1)
            expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
          })
        })
      })

      describe('and the authenticatable multi factor is not active (activity limit has passed)', (): void => {
        it('returns success', async (): Promise<void> => {
          const authentication = new Authentication({ multiFactorActivityLimit: '2 seconds', secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'multi-factor', identifier: 'any.multi-factor-active' })

          const result = await authentication.performDynamic('verify-multi-factor', { credential: 'any.multi-factor-active', oneTimePassword })

          expect(result).toEqual({ status: 'failure', message: 'multi-factor-inactive' })
          expect(SaveAuthenticatableDynamic).not.toHaveBeenPerformed()
        })
      })
    })

    describe('when the one time password is not valid', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const result = await authentication.performDynamic('verify-multi-factor', { credential: 'any', oneTimePassword: 'nop' })

        expect(result).toEqual({ status: 'failure', message: 'invalid-one-time-password' })
        expect(SaveAuthenticatableDynamic).not.toHaveBeenPerformed()
      })
    })
  })
})

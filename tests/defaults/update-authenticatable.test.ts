import { Authentication } from '../../src'
import SaveAuthenticatableDynamic from '../../src/defaults/extended/SaveAuthenticatable.universal-auth-dynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe('Authentication', (): void => {
  describe('default-dynamics', (): void => {
    describe('update-authenticatable', (): void => {
      describe('when providing right attributes to change', (): void => {
        it('returns success', async (): Promise<void> => {
          const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          const authenticatable = TestAuthenticatable.findByCredential('any')

          const result = await authentication.performDynamic('update-authenticatable', { authenticatable, attributes: { username: 'new', password: '123456789' } })

          expect(result).toEqual({ status: 'success', authenticatable })
          expect(result.authenticatable.username).toEqual('new')
          expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable })
        })

        it('ignores credential attributes', async (): Promise<void> => {
          const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          const authenticatable = TestAuthenticatable.findByCredential('any')

          const result = await authentication.performDynamic('update-authenticatable', { authenticatable, attributes: { email: '....', phone: '2313123' } })

          expect(result).toEqual({ status: 'success', authenticatable })
          expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable })
        })

        it('ignores to validate attributes not being changed', async (): Promise<void> => {
          const authentication = new Authentication(
            { validations: { firstName: { size: { min: 2, max: 12 } } }, secret: '123', dynamicsLocation: './src/defaults' },
            TestAuthenticatable
          )
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          const authenticatable = TestAuthenticatable.findByCredential('any')

          const result = await authentication.performDynamic('update-authenticatable', { authenticatable, attributes: { firstName: 'yes' } })

          expect(result).toEqual({ status: 'success', authenticatable })
          expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable })
        })
      })

      describe('when providing invalid attributes to change', (): void => {
        it('returns success', async (): Promise<void> => {
          const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          const authenticatable = TestAuthenticatable.findByCredential('any')

          const result = await authentication.performDynamic('update-authenticatable', { authenticatable, attributes: { username: '....', password: '12' } })

          expect(result).toEqual({ status: 'failure', validation: { valid: false, errors: { password: ['password-out-of-size'] } } })
          expect(SaveAuthenticatableDynamic).not.toHaveBeenPerformed()
        })
      })
    })
  })
})

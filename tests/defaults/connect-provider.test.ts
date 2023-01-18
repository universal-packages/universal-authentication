import { Authentication } from '../../src'
import GetUniversalUserDataDynamic from '../__fixtures__/GetUniversalDataDynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe('Authentication', (): void => {
  describe('default-dynamics', (): void => {
    describe('connect-provider', (): void => {
      describe('when the provider dynamic does not exist', (): void => {
        it('throws the standard error', async (): Promise<void> => {
          const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          const authenticatable = await TestAuthenticatable.findByProviderId('universal', 80085)
          let error: Error

          try {
            await authentication.performDynamic('connect-provider', { authenticatable, provider: 'unknown', token: 'token' })
          } catch (err) {
            error = err
          }

          expect(error.message).toEqual('"get-unknown-user-data" dynamic does not exist in this api')
        })
      })

      describe('when the authenticatable is already connected', (): void => {
        it('returns a warning', async (): Promise<void> => {
          const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          const authenticatable = await TestAuthenticatable.findByProviderId('universal', 'any.universal-connected')

          const result = await authentication.performDynamic('connect-provider', { authenticatable, provider: 'universal', token: 'token' })

          expect(result).toEqual({ status: 'warning', message: 'already-connected' })
        })
      })

      describe('when the authenticatable is not connected yet', (): void => {
        describe('and the provider returns the expect user data', (): void => {
          it('returns success', async (): Promise<void> => {
            const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
            authentication.options['namespace'] = 'universal-auth'
            await authentication.loadDynamics()

            authentication.dynamics['get-universal-user-data'] = {
              afterHooks: [],
              beforeHooks: [],
              implementations: [],
              name: 'get-universal-user-data',
              default: GetUniversalUserDataDynamic
            }

            const authenticatable = await TestAuthenticatable.findByProviderId('another', 'any')

            const result = await authentication.performDynamic('connect-provider', { authenticatable, provider: 'universal', token: 'exists' })

            expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
            expect(TestAuthenticatable.lastInstance['universalId']).toEqual('any')
            expect(result.authenticatable.save).toHaveBeenCalled()
          })
        })

        describe('and the provider returns error', (): void => {
          it('returns failure', async (): Promise<void> => {
            const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
            authentication.options['namespace'] = 'universal-auth'
            await authentication.loadDynamics()

            authentication.dynamics['get-universal-user-data'] = {
              afterHooks: [],
              beforeHooks: [],
              implementations: [],
              name: 'get-universal-user-data',
              default: GetUniversalUserDataDynamic
            }

            const authenticatable = await TestAuthenticatable.findByProviderId('another', 80085)

            const result = await authentication.performDynamic('connect-provider', { authenticatable, provider: 'universal', token: 'error' })

            expect(result).toEqual({ status: 'failure', message: 'provider-error' })
          })
        })
      })
    })
  })
})

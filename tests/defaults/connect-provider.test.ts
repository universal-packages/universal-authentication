import { Authentication } from '../../src'
import IsAuthenticatableConnectedDynamic from '../../src/defaults/extended/IsAuthenticatableConnected.universal-auth-dynamic'
import SaveAuthenticatableDynamic from '../../src/defaults/extended/SaveAuthenticatable.universal-auth-dynamic'
import GetUniversalUserDataDynamic from '../__fixtures__/GetUniversalDataDynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

beforeEach((): void => {
  TestAuthenticatable.lastInstance = undefined
})

describe(Authentication, (): void => {
  describe('connect-provider', (): void => {
    describe('when the provider dynamic does not exist', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const authenticatable = await TestAuthenticatable.findByProviderId('universal', 80085)

        const result = await authentication.performDynamic('connect-provider', { authenticatable, provider: 'unknown', token: 'token' })

        expect(result).toEqual({ status: 'failure', message: 'unknown-provider' })
        expect(IsAuthenticatableConnectedDynamic).toHaveBeenPerformedWith({ authenticatable, provider: 'unknown' })
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
        expect(IsAuthenticatableConnectedDynamic).toHaveBeenPerformedWith({ authenticatable, provider: 'universal' })
      })
    })

    describe('when the authenticatable is not connected yet', (): void => {
      describe('and the provider returns the expect user data', (): void => {
        it('returns success', async (): Promise<void> => {
          const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults', providerKeys: { universal: { secret: 'yes' } } }, TestAuthenticatable)
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          authentication.dynamics['get-universal-user-data'] = {
            afterHooks: [],
            beforeHooks: [],
            implementations: [],
            name: 'get-universal-user-data',
            default: GetUniversalUserDataDynamic
          }
          GetUniversalUserDataDynamic.__api = Authentication

          const authenticatable = await TestAuthenticatable.findByProviderId('another', 'any')

          const result = await authentication.performDynamic('connect-provider', { authenticatable, provider: 'universal', token: 'exists' })

          expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
          expect(TestAuthenticatable.lastInstance['universalId']).toEqual('any.universal-connected')
          expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
          expect(IsAuthenticatableConnectedDynamic).toHaveBeenPerformedWith({ authenticatable, provider: 'universal' })
          expect(GetUniversalUserDataDynamic).toHaveBeenPerformedWith({ token: 'exists', keys: { secret: 'yes' } })
        })
      })

      describe('and the provider returns error', (): void => {
        it('returns failure', async (): Promise<void> => {
          const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults', providerKeys: { universal: { secret: 'yes' } } }, TestAuthenticatable)
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          authentication.dynamics['get-universal-user-data'] = {
            afterHooks: [],
            beforeHooks: [],
            implementations: [],
            name: 'get-universal-user-data',
            default: GetUniversalUserDataDynamic
          }
          GetUniversalUserDataDynamic.__api = Authentication

          const authenticatable = await TestAuthenticatable.findByProviderId('another', 80085)

          const result = await authentication.performDynamic('connect-provider', { authenticatable, provider: 'universal', token: 'error' })

          expect(result).toEqual({ status: 'failure', message: 'provider-error' })
          expect(IsAuthenticatableConnectedDynamic).toHaveBeenPerformedWith({ authenticatable, provider: 'universal' })
          expect(GetUniversalUserDataDynamic).toHaveBeenPerformedWith({ token: 'error', keys: { secret: 'yes' } })
        })
      })
    })
  })
})

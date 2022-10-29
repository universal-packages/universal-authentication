import { Authentication } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe('Authentication', (): void => {
  describe('default-dynamics', (): void => {
    describe('log-in', (): void => {
      describe('providing right credentials', (): void => {
        it('returns success with the authenticatable', async (): Promise<void> => {
          const authentication = new Authentication({ encryptionSecret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
          authentication.options['namespace'] = 'universal-auth'

          await authentication.loadDynamics()

          const result = await authentication.performDynamic('log-in', { credential: 'universal', password: 'secret' })

          expect(result.status).toEqual('success')
          expect(result.authenticatable).not.toBeUndefined()
          expect(result.authenticatable.logInCount).toEqual(0)
        })
      })
    })
  })
})

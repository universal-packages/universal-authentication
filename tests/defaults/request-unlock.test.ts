import { Authentication, CredentialKind } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe('Authentication', (): void => {
  describe('default-dynamics', (): void => {
    describe('request-unlock', (): void => {
      const credentialKinds: CredentialKind[] = ['email', 'phone']

      credentialKinds.forEach((credentialKind: CredentialKind): void => {
        describe(`when using ${credentialKind} to request unlock`, (): void => {
          it('returns success', async (): Promise<void> => {
            const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
            authentication.options['namespace'] = 'universal-auth'
            await authentication.loadDynamics()

            const authenticatable = TestAuthenticatable.findByCredential(credentialKind)

            const result = await authentication.performDynamic('request-unlock', { authenticatable, credentialKind })

            expect(result).toEqual({ status: 'success', metadata: { oneTimePassword: expect.any(String) } })
          })
        })
      })
    })
  })
})

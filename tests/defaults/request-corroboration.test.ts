import { Authentication, CredentialKind } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe('Authentication', (): void => {
  describe('default-dynamics', (): void => {
    describe('request-corroboration', (): void => {
      const credentialKinds: CredentialKind[] = ['email', 'phone']

      credentialKinds.forEach((credentialKind: CredentialKind): void => {
        describe(`when using ${credentialKind} to request corroboration`, (): void => {
          describe('and sign up corroboration is enabled', (): void => {
            it('returns success', async (): Promise<void> => {
              const authentication = new Authentication(
                {
                  [credentialKind]: { enableCorroboration: true },
                  secret: '123',
                  dynamicsLocation: './src/defaults'
                },
                TestAuthenticatable
              )
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const result = await authentication.performDynamic('request-corroboration', { credential: credentialKind, credentialKind })

              expect(result).toEqual({ status: 'success' })
            })
          })
        })

        describe('and sign up corroboration is not enabled', (): void => {
          it('returns failure', async (): Promise<void> => {
            const authentication = new Authentication(
              {
                [credentialKind]: { enableCorroboration: false },
                secret: '123',
                dynamicsLocation: './src/defaults'
              },
              TestAuthenticatable
            )
            authentication.options['namespace'] = 'universal-auth'
            await authentication.loadDynamics()

            const result = await authentication.performDynamic('request-corroboration', { credential: '', credentialKind })

            expect(result).toEqual({ status: 'failure', message: 'corroboration-disabled' })
          })
        })
      })
    })
  })
})

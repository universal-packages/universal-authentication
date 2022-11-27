import { Authentication, CredentialKind } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe('Authentication', (): void => {
  describe('default-dynamics', (): void => {
    describe('request-password-reset', (): void => {
      const credentialKinds: CredentialKind[] = ['email', 'phone']

      credentialKinds.forEach((credentialKind: CredentialKind): void => {
        describe(`when using ${credentialKind} to request corroboration`, (): void => {
          describe('and the credential is valid', (): void => {
            it('returns success', async (): Promise<void> => {
              const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const result = await authentication.performDynamic('request-password-reset', { credential: credentialKind, credentialKind })

              expect(result).toEqual({ status: 'success', metadata: { oneTimePassword: expect.any(String) } })
            })
          })

          describe('and the credential is not valid', (): void => {
            it('returns success', async (): Promise<void> => {
              const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const result = await authentication.performDynamic('request-password-reset', { credential: `${credentialKind}-nop`, credentialKind })

              expect(result).toEqual({ status: 'warning', message: 'nothing-to-do' })
            })
          })
        })
      })
    })
  })
})

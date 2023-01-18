import { Authentication, CredentialKind } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe('Authentication', (): void => {
  describe('default-dynamics', (): void => {
    describe('verify-corroboration', (): void => {
      const credentialKinds: CredentialKind[] = ['email', 'phone']

      credentialKinds.forEach((credentialKind: CredentialKind): void => {
        describe(`when verifying a ${credentialKind}`, (): void => {
          describe('when the one time password is valid', (): void => {
            it('returns success', async (): Promise<void> => {
              const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', {
                concern: 'corroboration',
                identifier: `${credentialKind}.${credentialKind}`
              })

              const result = await authentication.performDynamic('verify-corroboration', { credential: credentialKind, credentialKind, oneTimePassword })

              expect(result).toEqual({ status: 'success', metadata: { corroborationToken: expect.any(String) } })
            })
          })

          describe('when the one time password is not valid', (): void => {
            it('returns failure', async (): Promise<void> => {
              const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const result = await authentication.performDynamic('verify-corroboration', { credential: credentialKind, credentialKind, oneTimePassword: 'nop' })

              expect(result).toEqual({ status: 'failure', message: 'invalid-one-time-password' })
            })
          })
        })
      })
    })
  })
})

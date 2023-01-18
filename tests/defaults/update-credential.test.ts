import { Authentication, CredentialKind } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe('Authentication', (): void => {
  describe('default-dynamics', (): void => {
    describe('update-credential', (): void => {
      const credentialKinds: CredentialKind[] = ['email', 'phone']
      const credentialValues = { email: 'DAVID@UNIVERSAL.com', phone: '+524497654321' }

      credentialKinds.forEach((credentialKind: CredentialKind): void => {
        describe(`when updating ${credentialKind}`, (): void => {
          describe('and providing a valid credential', (): void => {
            it('returns success', async (): Promise<void> => {
              const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const authenticatable = TestAuthenticatable.findByCredential('any')

              const result = await authentication.performDynamic('update-credential', { authenticatable, credential: credentialValues[credentialKind], credentialKind })

              expect(result).toEqual({ status: 'success', authenticatable })
              expect(authenticatable.save).toHaveBeenCalled()
            })
          })

          describe('and providing an invalid credential', (): void => {
            it('returns success', async (): Promise<void> => {
              const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const authenticatable = TestAuthenticatable.findByCredential('any')

              const result = await authentication.performDynamic('update-credential', { authenticatable, credential: 'nop', credentialKind })

              expect(result).toEqual({ status: 'failure', validation: { valid: false, errors: { [credentialKind]: [`invalid-${credentialKind}`] } } })
              expect(authenticatable.save).not.toHaveBeenCalled()
            })
          })
        })
      })
    })
  })
})

import { Authentication, CredentialKind } from '../../src'
import SendConfirmationDynamic from '../../src/defaults/extended/SendConfirmation.universal-auth-dynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

beforeEach((): void => {
  TestAuthenticatable.lastInstance = undefined
})

describe(Authentication, (): void => {
  describe('request-confirmation', (): void => {
    const credentialKinds: CredentialKind[] = ['email', 'phone']

    credentialKinds.forEach((credentialKind: CredentialKind): void => {
      describe(`when using ${credentialKind} to request confirmation`, (): void => {
        describe('and confirmation is enabled', (): void => {
          it('returns success', async (): Promise<void> => {
            const authentication = new Authentication(
              {
                [credentialKind]: { enableConfirmation: true },
                secret: '123',
                dynamicsLocation: './src/defaults'
              },
              TestAuthenticatable
            )
            authentication.options['namespace'] = 'universal-auth'
            await authentication.loadDynamics()

            const result = await authentication.performDynamic('request-confirmation', { credential: credentialKind, credentialKind })

            expect(result).toEqual({ status: 'success' })
            expect(SendConfirmationDynamic).toHaveBeenPerformedWith({ credential: credentialKind, credentialKind, oneTimePassword: expect.any(String) })
          })
        })

        describe('and confirmation is not enabled', (): void => {
          it('returns failure', async (): Promise<void> => {
            const authentication = new Authentication(
              {
                [credentialKind]: { enableConfirmation: false },
                secret: '123',
                dynamicsLocation: './src/defaults'
              },
              TestAuthenticatable
            )
            authentication.options['namespace'] = 'universal-auth'
            await authentication.loadDynamics()

            const result = await authentication.performDynamic('request-confirmation', { credential: '', credentialKind })

            expect(result).toEqual({ status: 'failure', message: 'confirmation-disabled' })
            expect(SendConfirmationDynamic).not.toHaveBeenPerformed()
          })
        })
      })
    })
  })
})

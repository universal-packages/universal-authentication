import { Authentication, CredentialKind } from '../../src'
import SaveAuthenticatableDynamic from '../../src/defaults/extended/SaveAuthenticatable.universal-auth-dynamic'
import SendConfirmationThanksDynamic from '../../src/defaults/extended/SendConfirmationThanks.universal-auth-dynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe(Authentication, (): void => {
  describe('verify-confirmation', (): void => {
    const credentialKinds: CredentialKind[] = ['email', 'phone']

    credentialKinds.forEach((credentialKind: CredentialKind): void => {
      describe(`when conforming a ${credentialKind}`, (): void => {
        describe('when the one time password is valid', (): void => {
          it('returns success', async (): Promise<void> => {
            const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
            authentication.options['namespace'] = 'universal-auth'
            await authentication.loadDynamics()

            const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', {
              concern: 'confirmation',
              identifier: `${credentialKind}.unconfirmed.${credentialKind}`
            })

            const result = await authentication.performDynamic('verify-confirmation', { credential: `${credentialKind}.unconfirmed`, credentialKind, oneTimePassword })

            expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
            expect(TestAuthenticatable.lastInstance[`${credentialKind}ConfirmedAt`]).toEqual(expect.any(Date))
            expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
            expect(SendConfirmationThanksDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance, credentialKind })
          })

          describe(`and the unconfirmed ${credentialKind} is the one to confirm`, (): void => {
            it('returns success and stablish the new credential', async (): Promise<void> => {
              const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', {
                concern: 'confirmation',
                identifier: `new.${credentialKind}`
              })

              const result = await authentication.performDynamic('verify-confirmation', { credential: `${credentialKind}.new-unconfirmed`, credentialKind, oneTimePassword })

              expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
              expect(TestAuthenticatable.lastInstance[credentialKind]).toEqual('new')
              expect(TestAuthenticatable.lastInstance[`unconfirmed${credentialKind.charAt(0).toUpperCase()}${credentialKind.slice(1)}`]).toBeNull()
              expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
              expect(SendConfirmationThanksDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance, credentialKind })
            })
          })
        })

        describe('when the one time password is not valid', (): void => {
          it('returns failure', async (): Promise<void> => {
            const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
            authentication.options['namespace'] = 'universal-auth'
            await authentication.loadDynamics()

            const result = await authentication.performDynamic('verify-confirmation', { credential: credentialKind, credentialKind, oneTimePassword: 'nop' })

            expect(result).toEqual({ status: 'failure', message: 'invalid-one-time-password' })
            expect(SaveAuthenticatableDynamic).not.toHaveBeenPerformed()
          })
        })
      })
    })
  })
})

import { Authentication, CredentialKind } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe('Authentication', (): void => {
  describe('default-dynamics', (): void => {
    describe('verify-password-reset', (): void => {
      const credentialKinds: CredentialKind[] = ['email', 'phone']

      credentialKinds.forEach((credentialKind: CredentialKind): void => {
        describe(`when verifying a ${credentialKind}`, (): void => {
          describe('when the one time password is valid', (): void => {
            it('returns success', async (): Promise<void> => {
              const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'password-reset', credential: credentialKind, credentialKind })

              const result = await authentication.performDynamic('verify-password-reset', { credential: credentialKind, credentialKind, oneTimePassword, password: 'new-password' })

              expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
              expect(TestAuthenticatable.lastInstance.password).toEqual('new-password')
              expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
            })

            describe('but the new password is not valid', (): void => {
              it('returns failure and validation', async (): Promise<void> => {
                const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
                authentication.options['namespace'] = 'universal-auth'
                await authentication.loadDynamics()

                const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'password-reset', credential: credentialKind, credentialKind })

                const result = await authentication.performDynamic('verify-password-reset', {
                  credential: credentialKind,
                  credentialKind,
                  oneTimePassword,
                  password: 'short'
                })

                expect(result).toEqual({ status: 'failure', validation: { valid: false, errors: { password: ['password-out-of-size'] } } })
                expect(TestAuthenticatable.lastInstance.password).not.toEqual('new-password')
                expect(TestAuthenticatable.lastInstance.save).not.toHaveBeenCalled()
              })
            })
          })

          describe('when the one time password is not valid', (): void => {
            it('returns failure', async (): Promise<void> => {
              const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const result = await authentication.performDynamic('verify-password-reset', { credential: credentialKind, credentialKind, oneTimePassword: 'nop', password: 'new' })

              expect(result).toEqual({ status: 'failure', message: 'invalid-one-time-password' })
            })
          })
        })
      })
    })
  })
})

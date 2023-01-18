import { Authentication, CredentialKind } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe('Authentication', (): void => {
  describe('default-dynamics', (): void => {
    describe('request-confirmation', (): void => {
      const credentialKinds: CredentialKind[] = ['email', 'phone']

      credentialKinds.forEach((credentialKind: CredentialKind): void => {
        describe(`when using ${credentialKind} to request confirmation`, (): void => {
          describe('and confirmation is enabled', (): void => {
            describe('when using authenticatable as payload param', (): void => {
              describe('and authenticatable is not confirmed', (): void => {
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

                  const authenticatable = TestAuthenticatable.findByCredential(`${credentialKind}.unconfirmed`)

                  const result = await authentication.performDynamic('request-confirmation', { authenticatable, credentialKind })

                  expect(result).toEqual({ status: 'success' })
                })
              })

              describe('and authenticatable is confirmed', (): void => {
                it('returns waring', async (): Promise<void> => {
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

                  const authenticatable = TestAuthenticatable.findByCredential(`${credentialKind}.confirmed`)

                  const result = await authentication.performDynamic('request-confirmation', { authenticatable, credentialKind })

                  expect(result).toEqual({ status: 'warning', message: 'nothing-to-do' })
                })
              })
            })

            describe('when using credential as payload param', (): void => {
              describe('and authenticatable is not confirmed', (): void => {
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

                  const result = await authentication.performDynamic('request-confirmation', { credential: `${credentialKind}.unconfirmed`, credentialKind })

                  expect(result).toEqual({ status: 'success' })
                })
              })

              describe('and authenticatable is confirmed', (): void => {
                it('returns waring', async (): Promise<void> => {
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

                  const result = await authentication.performDynamic('request-confirmation', { credential: `${credentialKind}.confirmed`, credentialKind })

                  expect(result).toEqual({ status: 'warning', message: 'nothing-to-do' })
                })
              })
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
            })
          })
        })
      })
    })
  })
})

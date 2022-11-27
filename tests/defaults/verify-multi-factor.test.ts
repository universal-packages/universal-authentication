import { Authentication, CredentialKind } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe('Authentication', (): void => {
  describe('default-dynamics', (): void => {
    describe('verify-multi-factor', (): void => {
      const credentialKinds: CredentialKind[] = ['email', 'phone']

      credentialKinds.forEach((credentialKind: CredentialKind): void => {
        describe(`when completing a ${credentialKind} multi factor`, (): void => {
          describe('when the one time password is valid', (): void => {
            it('returns success', async (): Promise<void> => {
              const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', {
                concern: 'multi-factor',
                credential: `${credentialKind}-multi-factor-active`,
                credentialKind
              })

              const result = await authentication.performDynamic('verify-multi-factor', { credential: `${credentialKind}-multi-factor-active`, credentialKind, oneTimePassword })

              expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
              expect(TestAuthenticatable.lastInstance.multiFactorActive).toEqual(false)
              expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
            })

            describe('and confirmation is enabled', (): void => {
              describe(`and authenticatable ${credentialKind} is confirmed`, (): void => {
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

                  const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', {
                    concern: 'multi-factor',
                    credential: `${credentialKind}-confirmed`,
                    credentialKind
                  })

                  const result = await authentication.performDynamic('verify-multi-factor', { credential: `${credentialKind}-confirmed`, credentialKind, oneTimePassword })

                  expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
                })
              })

              describe(`and authenticatable ${credentialKind} is not confirmed`, (): void => {
                describe('and confirmation is enforced', (): void => {
                  it('returns warning', async (): Promise<void> => {
                    const authentication = new Authentication(
                      {
                        [credentialKind]: { enableConfirmation: true, enforceConfirmation: true },
                        secret: '123',
                        dynamicsLocation: './src/defaults'
                      },
                      TestAuthenticatable
                    )
                    authentication.options['namespace'] = 'universal-auth'
                    await authentication.loadDynamics()

                    const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', {
                      concern: 'multi-factor',
                      credential: `${credentialKind}-unconfirmed`,
                      credentialKind
                    })

                    const result = await authentication.performDynamic('verify-multi-factor', { credential: `${credentialKind}-unconfirmed`, credentialKind, oneTimePassword })

                    expect(result).toEqual({ status: 'warning', message: 'confirmation-required', metadata: { credential: `${credentialKind}-unconfirmed`, credentialKind } })
                  })
                })

                describe('and confirmation is not enforced', (): void => {
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

                    const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', {
                      concern: 'multi-factor',
                      credential: `${credentialKind}-unconfirmed`,
                      credentialKind
                    })

                    const result = await authentication.performDynamic('verify-multi-factor', { credential: `${credentialKind}-unconfirmed`, credentialKind, oneTimePassword })

                    expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
                  })

                  describe('but a confirmation grace period is set', (): void => {
                    describe('and the unconfirmation has passed that period', (): void => {
                      it('returns warning', async (): Promise<void> => {
                        const authentication = new Authentication(
                          {
                            [credentialKind]: { confirmationGracePeriod: '2 second', enableConfirmation: true },
                            secret: '123',
                            dynamicsLocation: './src/defaults'
                          },
                          TestAuthenticatable
                        )
                        authentication.options['namespace'] = 'universal-auth'
                        await authentication.loadDynamics()

                        const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', {
                          concern: 'multi-factor',
                          credential: `${credentialKind}-unconfirmed`,
                          credentialKind
                        })

                        const result = await authentication.performDynamic('verify-multi-factor', { credential: `${credentialKind}-unconfirmed`, credentialKind, oneTimePassword })

                        expect(result).toEqual({
                          status: 'warning',
                          message: 'confirmation-required',
                          metadata: { credential: `${credentialKind}-unconfirmed`, credentialKind }
                        })
                      })
                    })

                    describe('and the unconfirmation has not passed that period', (): void => {
                      it('returns success', async (): Promise<void> => {
                        const authentication = new Authentication(
                          {
                            [credentialKind]: { confirmationGracePeriod: '1 hour', enableConfirmation: true },
                            secret: '123',
                            dynamicsLocation: './src/defaults'
                          },
                          TestAuthenticatable
                        )
                        authentication.options['namespace'] = 'universal-auth'
                        await authentication.loadDynamics()

                        const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', {
                          concern: 'multi-factor',
                          credential: `${credentialKind}-unconfirmed`,
                          credentialKind
                        })

                        const result = await authentication.performDynamic('verify-multi-factor', { credential: `${credentialKind}-unconfirmed`, credentialKind, oneTimePassword })

                        expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
                      })
                    })
                  })
                })
              })
            })

            describe('and log in count is enabled', (): void => {
              it('sets the authenticatable login count', async (): Promise<void> => {
                const authentication = new Authentication({ enableLogInCount: true, secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
                authentication.options['namespace'] = 'universal-auth'
                await authentication.loadDynamics()

                const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', {
                  concern: 'multi-factor',
                  credential: credentialKind,
                  credentialKind
                })

                const result = await authentication.performDynamic('verify-multi-factor', { credential: credentialKind, credentialKind, oneTimePassword })

                expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
                expect(result.authenticatable.logInCount).toEqual(1)
              })
            })
          })

          describe('when the one time password is not valid', (): void => {
            it('returns failure', async (): Promise<void> => {
              const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const result = await authentication.performDynamic('verify-multi-factor', { credential: credentialKind, credentialKind, oneTimePassword: 'nop' })

              expect(result).toEqual({ status: 'failure', message: 'invalid-one-time-password' })
            })
          })
        })
      })
    })
  })
})

import { Authentication, CredentialKind } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe('Authentication', (): void => {
  describe('default-dynamics', (): void => {
    describe('log-in', (): void => {
      const credentialKinds: CredentialKind[] = ['email', 'phone']

      credentialKinds.forEach((credentialKind: CredentialKind): void => {
        describe(`when using ${credentialKind} to log in`, (): void => {
          describe(`and the right ${credentialKind} is provided (no features enabled)`, (): void => {
            it('returns success', async (): Promise<void> => {
              const authentication = new Authentication(
                {
                  [credentialKind]: { enablePasswordCheck: false },
                  secret: '123',
                  dynamicsLocation: './src/defaults'
                },
                TestAuthenticatable
              )
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const result = await authentication.performDynamic('log-in', { credential: `${credentialKind}` })

              expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
              expect(result.authenticatable.logInCount).toEqual(0)
            })

            describe('and locking is enabled and unlockAfter is specified', (): void => {
              describe('and authenticatable is locked', (): void => {
                describe('and authenticatable is ready to be unlock', (): void => {
                  it('unlocks the authenticatable', async (): Promise<void> => {
                    const authentication = new Authentication(
                      {
                        [credentialKind]: { enablePasswordCheck: false },
                        enableLocking: true,
                        unlockAfter: '1 second',
                        secret: '123',
                        dynamicsLocation: './src/defaults'
                      },
                      TestAuthenticatable
                    )
                    authentication.options['namespace'] = 'universal-auth'
                    await authentication.loadDynamics()

                    await authentication.performDynamic('log-in', { credential: `${credentialKind}-ready-to-unlock` })

                    expect(TestAuthenticatable.lastInstance.lockedAt).toBeNull()
                    expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
                  })
                })

                describe('and authenticatable is not ready to be unlock', (): void => {
                  it('returns failure does nothing else', async (): Promise<void> => {
                    const authentication = new Authentication(
                      {
                        [credentialKind]: { enablePasswordCheck: false },
                        enableLocking: true,
                        unlockAfter: '1 second',
                        secret: '123',
                        dynamicsLocation: './src/defaults'
                      },
                      TestAuthenticatable
                    )
                    authentication.options['namespace'] = 'universal-auth'
                    await authentication.loadDynamics()

                    const result = await authentication.performDynamic('log-in', { credential: `${credentialKind}-locked` })

                    expect(result).toEqual({ status: 'failure', message: 'invalid-credentials' })
                    expect(TestAuthenticatable.lastInstance.lockedAt).not.toBeNull()
                    expect(TestAuthenticatable.lastInstance.save).not.toHaveBeenCalled()
                  })
                })
              })

              describe('and authenticatable is not locked', (): void => {
                it('does nothing', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { enablePasswordCheck: false },
                      enableLocking: true,
                      unlockAfter: '1 second',
                      secret: '123',
                      dynamicsLocation: './src/defaults'
                    },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const result = await authentication.performDynamic('log-in', { credential: `${credentialKind}` })

                  expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
                })
              })
            })

            describe('and password check is enabled', (): void => {
              describe('and the right password is provided', (): void => {
                it('returns success', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { passwordCheck: true },
                      secret: '123',
                      dynamicsLocation: './src/defaults'
                    },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const result = await authentication.performDynamic('log-in', { credential: `${credentialKind}`, password: 'password' })

                  expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
                })

                describe('and confirmation is enabled', (): void => {
                  describe(`and authenticatable ${credentialKind} is confirmed`, (): void => {
                    it('returns success', async (): Promise<void> => {
                      const authentication = new Authentication(
                        {
                          [credentialKind]: { enablePasswordCheck: true, enableConfirmation: true },
                          secret: '123',
                          dynamicsLocation: './src/defaults'
                        },
                        TestAuthenticatable
                      )
                      authentication.options['namespace'] = 'universal-auth'
                      await authentication.loadDynamics()

                      const result = await authentication.performDynamic('log-in', { credential: `${credentialKind}-confirmed`, password: 'password' })

                      expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
                    })
                  })

                  describe(`and authenticatable ${credentialKind} is not confirmed`, (): void => {
                    describe('and confirmation is enforced', (): void => {
                      it('returns warning', async (): Promise<void> => {
                        const authentication = new Authentication(
                          {
                            [credentialKind]: { enablePasswordCheck: true, enableConfirmation: true, enforceConfirmation: true },
                            secret: '123',
                            dynamicsLocation: './src/defaults'
                          },
                          TestAuthenticatable
                        )
                        authentication.options['namespace'] = 'universal-auth'
                        await authentication.loadDynamics()

                        const result = await authentication.performDynamic('log-in', { credential: `${credentialKind}-unconfirmed`, password: 'password' })

                        expect(result).toEqual({ status: 'warning', message: 'confirmation-required' })
                      })
                    })

                    describe('and confirmation is not enforced', (): void => {
                      it('returns success', async (): Promise<void> => {
                        const authentication = new Authentication(
                          {
                            [credentialKind]: { enablePasswordCheck: true, enableConfirmation: true },
                            secret: '123',
                            dynamicsLocation: './src/defaults'
                          },
                          TestAuthenticatable
                        )
                        authentication.options['namespace'] = 'universal-auth'
                        await authentication.loadDynamics()

                        const result = await authentication.performDynamic('log-in', { credential: `${credentialKind}-unconfirmed`, password: 'password' })

                        expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
                      })

                      describe('but a confirmation grace period is set', (): void => {
                        describe('and the unconfirmation has passed that period', (): void => {
                          it('returns warning', async (): Promise<void> => {
                            const authentication = new Authentication(
                              {
                                [credentialKind]: { confirmationGracePeriod: '2 second', enablePasswordCheck: true, enableConfirmation: true },
                                secret: '123',
                                dynamicsLocation: './src/defaults'
                              },
                              TestAuthenticatable
                            )
                            authentication.options['namespace'] = 'universal-auth'
                            await authentication.loadDynamics()

                            const result = await authentication.performDynamic('log-in', { credential: `${credentialKind}-unconfirmed`, password: 'password' })

                            expect(result).toEqual({ status: 'warning', message: 'confirmation-required' })
                          })
                        })

                        describe('and the unconfirmation has not passed that period', (): void => {
                          it('returns success', async (): Promise<void> => {
                            const authentication = new Authentication(
                              {
                                [credentialKind]: { confirmationGracePeriod: '1 hour', enablePasswordCheck: true, enableConfirmation: true },
                                secret: '123',
                                dynamicsLocation: './src/defaults'
                              },
                              TestAuthenticatable
                            )
                            authentication.options['namespace'] = 'universal-auth'
                            await authentication.loadDynamics()

                            const result = await authentication.performDynamic('log-in', { credential: `${credentialKind}-unconfirmed`, password: 'password' })

                            expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
                          })
                        })
                      })
                    })
                  })
                })

                describe('and multi-factor is enabled', (): void => {
                  describe('and multi-factor is enforced', (): void => {
                    it('returns warning and sets authenticatable multi-factor', async (): Promise<void> => {
                      const authentication = new Authentication(
                        {
                          [credentialKind]: { enablePasswordCheck: true },
                          enableMultiFactor: true,
                          enforceMultiFactor: true,
                          secret: '123',
                          dynamicsLocation: './src/defaults'
                        },
                        TestAuthenticatable
                      )
                      authentication.options['namespace'] = 'universal-auth'
                      await authentication.loadDynamics()

                      const credentialPerCase = { email: 'email-david@universal.com', phone: 'phone-+524401234567' }
                      const obfuscatedCredentialPerCase = { email: 'e*********d@universal.com', phone: '*****************67' }

                      const result = await authentication.performDynamic('log-in', { credential: credentialPerCase[credentialKind], password: 'password' })

                      expect(result).toEqual({
                        status: 'warning',
                        message: 'multi-factor-waiting',
                        authenticatable: expect.any(TestAuthenticatable),
                        metadata: { [credentialKind]: obfuscatedCredentialPerCase[credentialKind] }
                      })
                      expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
                      expect(TestAuthenticatable.lastInstance.multiFactorCurrentOneTimePassword).toMatch(/\d{6}/)
                      expect(TestAuthenticatable.lastInstance.multiFactorCurrentOneTimePasswordSetAt).not.toBeNull()
                    })

                    describe('and multi-factor is set to be sent in place', (): void => {
                      it('returns warning and sets authenticatable multi-factor', async (): Promise<void> => {
                        const authentication = new Authentication(
                          {
                            [credentialKind]: { enablePasswordCheck: true },
                            enableMultiFactor: true,
                            enforceMultiFactor: true,
                            sendMultiFactorInPlace: true,
                            secret: '123',
                            dynamicsLocation: './src/defaults'
                          },
                          TestAuthenticatable
                        )
                        authentication.options['namespace'] = 'universal-auth'
                        await authentication.loadDynamics()

                        const result = await authentication.performDynamic('log-in', { credential: `${credentialKind}`, password: 'password' })

                        expect(result).toEqual({ status: 'warning', message: 'multi-factor-inbound', authenticatable: expect.any(TestAuthenticatable) })
                        expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
                        expect(TestAuthenticatable.lastInstance.multiFactorCurrentOneTimePassword).toMatch(/\d{6}/)
                        expect(TestAuthenticatable.lastInstance.multiFactorCurrentOneTimePasswordSetAt).not.toBeNull()
                      })
                    })
                  })

                  describe('or authenticatable enabled multi-factor for itself', (): void => {
                    it(`returns warning and sets authenticatable ${credentialKind} multi-factor`, async (): Promise<void> => {
                      const authentication = new Authentication(
                        {
                          [credentialKind]: { enablePasswordCheck: true },
                          enableMultiFactor: true,
                          secret: '123',
                          dynamicsLocation: './src/defaults'
                        },
                        TestAuthenticatable
                      )
                      authentication.options['namespace'] = 'universal-auth'
                      await authentication.loadDynamics()

                      const result = await authentication.performDynamic('log-in', { credential: `${credentialKind}-multi-factor-enabled`, password: 'password' })

                      expect(result).toEqual({
                        status: 'warning',
                        message: 'multi-factor-waiting',
                        authenticatable: expect.any(TestAuthenticatable),
                        metadata: { [credentialKind]: expect.any(String) }
                      })
                      expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
                      expect(TestAuthenticatable.lastInstance.multiFactorCurrentOneTimePassword).toMatch(/\d{6}/)
                      expect(TestAuthenticatable.lastInstance.multiFactorCurrentOneTimePasswordSetAt).not.toBeNull()
                    })
                  })
                })
              })

              describe('and the wrong password is provided', (): void => {
                it('returns failure', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { enablePasswordCheck: true },
                      secret: '123',
                      dynamicsLocation: './src/defaults'
                    },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const result = await authentication.performDynamic('log-in', { credential: `${credentialKind}`, password: 'nop' })

                  expect(result).toEqual({ status: 'failure', message: 'invalid-credentials' })
                })

                describe('and locking is enabled and max attempts until lock is set', (): void => {
                  it('increments the number of failed attempts', async (): Promise<void> => {
                    const authentication = new Authentication(
                      {
                        [credentialKind]: { enablePasswordCheck: true },
                        enableLocking: true,
                        secret: '123',
                        dynamicsLocation: './src/defaults'
                      },
                      TestAuthenticatable
                    )
                    authentication.options['namespace'] = 'universal-auth'
                    await authentication.loadDynamics()

                    await authentication.performDynamic('log-in', { credential: `${credentialKind}`, password: 'nop' })

                    expect(TestAuthenticatable.lastInstance.failedLogInAttempts).toEqual(1)
                    expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
                  })

                  describe('and authenticatable is about to lock', (): void => {
                    it('locks it', async (): Promise<void> => {
                      const authentication = new Authentication(
                        {
                          [credentialKind]: { enablePasswordCheck: true },
                          enableLocking: true,
                          maxAttemptsUntilLock: 3,
                          secret: '123',
                          dynamicsLocation: './src/defaults'
                        },
                        TestAuthenticatable
                      )
                      authentication.options['namespace'] = 'universal-auth'
                      await authentication.loadDynamics()

                      await authentication.performDynamic('log-in', { credential: `${credentialKind}-about-to-lock`, password: 'nop' })

                      expect(TestAuthenticatable.lastInstance.failedLogInAttempts).toEqual(3)
                      expect(TestAuthenticatable.lastInstance.lockedAt).toEqual(expect.any(Date))
                      expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
                    })
                  })
                })
              })
            })
          })

          describe(`and the wrong ${credentialKind} is provided (no features enabled)`, (): void => {
            it('returns failure', async (): Promise<void> => {
              const authentication = new Authentication(
                {
                  [credentialKind]: { enablePasswordCheck: false },
                  secret: '123',
                  dynamicsLocation: './src/defaults'
                },
                TestAuthenticatable
              )
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const result = await authentication.performDynamic('log-in', { credential: `${credentialKind}-nop` })

              expect(result).toEqual({ status: 'failure', message: 'invalid-credentials' })
            })
          })
        })
      })
    })
  })
})

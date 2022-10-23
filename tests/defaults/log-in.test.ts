import { Authentication } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe('Authentication', (): void => {
  describe('default-dynamics', (): void => {
    describe('log-in', (): void => {
      describe('providing right credentials', (): void => {
        it('returns success with the authenticatable', async (): Promise<void> => {
          const authentication = new Authentication({ dynamicsLocation: './tests/__fixtures__/defaults' }, TestAuthenticatable)
          await authentication.loadDynamics()

          const result = await authentication.performDynamic('log-in', { credential: 'universal', password: 'secret' })

          expect(result.state).toEqual('success')
          expect(result.authenticatable).not.toBeUndefined()
          expect(result.authenticatable.logInCount).toEqual(0)
        })

        describe('and the enableLogInCount option is set', (): void => {
          it('returns success with the authenticatable ans sets the login count', async (): Promise<void> => {
            const authentication = new Authentication({ enableLogInCount: true, dynamicsLocation: './tests/__fixtures__/defaults' }, TestAuthenticatable)
            await authentication.loadDynamics()

            const result = await authentication.performDynamic('log-in', { credential: 'universal', password: 'secret' })

            expect(result.state).toEqual('success')
            expect(result.authenticatable).not.toBeUndefined()
            expect(result.authenticatable.logInCount).toEqual(1)
          })
        })

        describe('and the enableMultiFactor option is set', (): void => {
          describe('and the authenticatable has multi factor enabled', (): void => {
            it('returns warning and the authenticatable with the multi-factor token saved', async (): Promise<void> => {
              const authentication = new Authentication({ enableMultiFactor: true, dynamicsLocation: './tests/__fixtures__/defaults' }, TestAuthenticatable)
              await authentication.loadDynamics()

              const result = await authentication.performDynamic('log-in', { credential: '<multi-factor>', password: 'secret' })

              expect(result.state).toEqual('warning')
              expect(result.authenticatable).not.toBeUndefined()
              expect(result.authenticatable.multiFactorToken).toEqual(expect.any(String))
              expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
            })
          })

          describe('and the authenticatable has multi factor disabled', (): void => {
            it('returns success with the authenticatable', async (): Promise<void> => {
              const authentication = new Authentication({ enableMultiFactor: true, dynamicsLocation: './tests/__fixtures__/defaults' }, TestAuthenticatable)
              await authentication.loadDynamics()

              const result = await authentication.performDynamic('log-in', { credential: 'universal', password: 'secret' })

              expect(result.state).toEqual('success')
              expect(result.authenticatable).not.toBeUndefined()
            })

            describe('but the multi-factor is enforced by enforceMultiFactor option', (): void => {
              it('returns warning and the authenticatable with the multi-factor token saved', async (): Promise<void> => {
                const authentication = new Authentication(
                  { enableMultiFactor: true, enforceMultiFactor: true, dynamicsLocation: './tests/__fixtures__/defaults' },
                  TestAuthenticatable
                )
                await authentication.loadDynamics()

                const result = await authentication.performDynamic('log-in', { credential: 'universal', password: 'secret' })

                expect(result.state).toEqual('warning')
                expect(result.authenticatable).not.toBeUndefined()
                expect(result.authenticatable.multiFactorToken).toEqual(expect.any(String))
                expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
              })
            })
          })
        })

        describe('and the authenticatable is locked', (): void => {
          describe('and the unlockAfter option is set', (): void => {
            describe('and the configured time has passed', (): void => {
              it('returns success and unlocks the authenticatable', async (): Promise<void> => {
                const authentication = new Authentication({ unlockAfter: '1 second', dynamicsLocation: './tests/__fixtures__/defaults' }, TestAuthenticatable)
                await authentication.loadDynamics()

                const result = await authentication.performDynamic('log-in', { credential: '<locked-ready>', password: 'secret' })

                expect(result.state).toEqual('success')
                expect(result.authenticatable).not.toBeUndefined()
              })
            })

            describe('and the configured time has not passed', (): void => {
              it('returns failure and does not unlock the authenticatable', async (): Promise<void> => {
                const authentication = new Authentication({ unlockAfter: '1 second', dynamicsLocation: './tests/__fixtures__/defaults' }, TestAuthenticatable)
                await authentication.loadDynamics()

                const result = await authentication.performDynamic('log-in', { credential: '<locked>', password: 'secret' })

                expect(result.state).toEqual('failure')
                expect(result.authenticatable).toBeUndefined()
              })
            })
          })
        })
      })

      describe('providing wrong credentials', (): void => {
        describe('and lockAfterMaxFailedAttempts option is not set', (): void => {
          it('returns failure', async (): Promise<void> => {
            const authentication = new Authentication({ dynamicsLocation: './tests/__fixtures__/defaults' }, TestAuthenticatable)
            await authentication.loadDynamics()

            const result = await authentication.performDynamic('log-in', { credential: 'universal', password: 'bad' })

            expect(result.state).toEqual('failure')
            expect(result.authenticatable).toBeUndefined()
            expect(TestAuthenticatable.lastInstance.failedLogInAttempts).toEqual(0)
            expect(TestAuthenticatable.lastInstance.save).not.toHaveBeenCalled()
          })
        })

        describe('and lockAfterMaxFailedAttempts option is set', (): void => {
          it('returns failure and sets the failed attempt', async (): Promise<void> => {
            const authentication = new Authentication({ dynamicsLocation: './tests/__fixtures__/defaults', lockAfterMaxFailedAttempts: true }, TestAuthenticatable)
            await authentication.loadDynamics()

            const result = await authentication.performDynamic('log-in', { credential: 'universal', password: 'bad' })

            expect(result.state).toEqual('failure')
            expect(result.authenticatable).toBeUndefined()
            expect(TestAuthenticatable.lastInstance.failedLogInAttempts).toEqual(1)
            expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
          })

          describe('and the authenticatable is about to lock', (): void => {
            it('returns failure and locks the authenticatable', async (): Promise<void> => {
              const authentication = new Authentication({ dynamicsLocation: './tests/__fixtures__/defaults', lockAfterMaxFailedAttempts: true }, TestAuthenticatable)
              await authentication.loadDynamics()

              const result = await authentication.performDynamic('log-in', { credential: '<about-to-lock>', password: 'bad' })

              expect(result.state).toEqual('failure')
              expect(result.authenticatable).toBeUndefined()
              expect(TestAuthenticatable.lastInstance.failedLogInAttempts).toEqual(5)
              expect(TestAuthenticatable.lastInstance.lockedAt).toEqual(expect.any(Date))
              expect(TestAuthenticatable.lastInstance.unlockToken).toEqual(expect.any(String))
              expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
            })
          })
        })
      })
    })
  })
})

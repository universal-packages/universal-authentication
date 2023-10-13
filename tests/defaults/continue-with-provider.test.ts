import { Authentication } from '../../src'
import SaveAuthenticatableDynamic from '../../src/defaults/extended/SaveAuthenticatable.universal-auth-dynamic'
import GetUniversalUserDataDynamic from '../__fixtures__/GetUniversalDataDynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

beforeEach((): void => {
  TestAuthenticatable.lastInstance = undefined
})

describe(Authentication, (): void => {
  describe('continue-with-provider', (): void => {
    describe('when the provider dynamic does not exist', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const result = await authentication.performDynamic('continue-with-provider', { provider: 'unknown', token: 'token' })

        expect(result).toEqual({ status: 'failure', message: 'unknown-provider' })
      })
    })

    describe('when the provider is registered', (): void => {
      describe('and the provider returns the expect user data', (): void => {
        describe('and there is an authenticatable linked already', (): void => {
          it('returns success', async (): Promise<void> => {
            const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
            authentication.options['namespace'] = 'universal-auth'
            await authentication.loadDynamics()

            authentication.dynamics['get-universal-user-data'] = {
              afterHooks: [],
              beforeHooks: [],
              implementations: [],
              name: 'get-universal-user-data',
              default: GetUniversalUserDataDynamic
            }

            const result = await authentication.performDynamic('continue-with-provider', { provider: 'universal', token: 'exists' })

            expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
            expect(SaveAuthenticatableDynamic).not.toHaveBeenPerformed()
          })

          describe('and confirmation is enabled', (): void => {
            describe('and the provider email is the same as the authenticatable email', (): void => {
              it('returns success and confirms the authenticatable email in place', async (): Promise<void> => {
                const authentication = new Authentication({ email: { enableConfirmation: true }, secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
                authentication.options['namespace'] = 'universal-auth'
                await authentication.loadDynamics()

                authentication.dynamics['get-universal-user-data'] = {
                  afterHooks: [],
                  beforeHooks: [],
                  implementations: [],
                  name: 'get-universal-user-data',
                  default: GetUniversalUserDataDynamic
                }

                const result = await authentication.performDynamic('continue-with-provider', { provider: 'universal', token: 'exists' })

                expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
                expect(result.authenticatable.emailConfirmedAt).toEqual(expect.any(Date))
                expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: result.authenticatable })
              })
            })

            describe('and the provider email is the same as the authenticatable unconfirmedEmail', (): void => {
              it('returns success and confirms the authenticatable email in place', async (): Promise<void> => {
                const authentication = new Authentication({ email: { enableConfirmation: true }, secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
                authentication.options['namespace'] = 'universal-auth'
                await authentication.loadDynamics()

                authentication.dynamics['get-universal-user-data'] = {
                  afterHooks: [],
                  beforeHooks: [],
                  implementations: [],
                  name: 'get-universal-user-data',
                  default: GetUniversalUserDataDynamic
                }

                const result = await authentication.performDynamic('continue-with-provider', { provider: 'universal', token: 'exists-confirmation-pending' })

                expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
                expect(result.authenticatable.emailConfirmedAt).toEqual(expect.any(Date))
                expect(result.authenticatable.unconfirmedEmail).toBeNull()
                expect(result.authenticatable.email).toEqual('user@universal.com')
                expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: result.authenticatable })
              })
            })

            describe('and the provider email does not match any email in record', (): void => {
              it('returns success and does nothing with confirmation', async (): Promise<void> => {
                const authentication = new Authentication({ email: { enableConfirmation: true }, secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
                authentication.options['namespace'] = 'universal-auth'
                await authentication.loadDynamics()

                authentication.dynamics['get-universal-user-data'] = {
                  afterHooks: [],
                  beforeHooks: [],
                  implementations: [],
                  name: 'get-universal-user-data',
                  default: GetUniversalUserDataDynamic
                }

                const result = await authentication.performDynamic('continue-with-provider', { provider: 'universal', token: 'exists-independent-email' })

                expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
                expect(result.authenticatable.emailConfirmedAt).toBeNull()
                expect(SaveAuthenticatableDynamic).not.toHaveBeenPerformed()
              })
            })
          })

          describe('and login count is enabled', (): void => {
            it('returns success and adds a new log in', async (): Promise<void> => {
              const authentication = new Authentication({ enableLogInCount: true, secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              authentication.dynamics['get-universal-user-data'] = {
                afterHooks: [],
                beforeHooks: [],
                implementations: [],
                name: 'get-universal-user-data',
                default: GetUniversalUserDataDynamic
              }

              const result = await authentication.performDynamic('continue-with-provider', { provider: 'universal', token: 'exists' })

              expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
              expect(result.authenticatable.logInCount).toEqual(1)
              expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: result.authenticatable })
            })
          })
        })

        describe('and no authenticatable is linked yet', (): void => {
          it('returns success', async (): Promise<void> => {
            const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
            authentication.options['namespace'] = 'universal-auth'
            await authentication.loadDynamics()

            authentication.dynamics['get-universal-user-data'] = {
              afterHooks: [],
              beforeHooks: [],
              implementations: [],
              name: 'get-universal-user-data',
              default: GetUniversalUserDataDynamic
            }

            const result = await authentication.performDynamic('continue-with-provider', { provider: 'universal', token: 'not-connected' })

            expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
            expect(result.authenticatable).toMatchObject({
              universalId: 'any.nothing',
              username: 'david-universal',
              email: 'user@universal.com',
              firstName: 'david',
              lastName: 'de anda',
              name: 'david de anda',
              profilePictureUrl: 'https://images.com/david'
            })
            expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: result.authenticatable })
          })
        })
      })

      describe('and the provider returns error', (): void => {
        it('returns failure', async (): Promise<void> => {
          const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          authentication.dynamics['get-universal-user-data'] = {
            afterHooks: [],
            beforeHooks: [],
            implementations: [],
            name: 'get-universal-user-data',
            default: GetUniversalUserDataDynamic
          }

          const result = await authentication.performDynamic('continue-with-provider', { provider: 'universal', token: 'error' })

          expect(result).toEqual({ status: 'failure', message: 'provider-error' })
        })
      })
    })
  })
})

import { Authentication, AuthenticationCredentialOptions, CredentialKind } from '../../src'
import SaveAuthenticatableDynamic from '../../src/defaults/extended/SaveAuthenticatable.universal-auth-dynamic'
import RequestConfirmationDynamic from '../../src/defaults/main/RequestConfirmation.universal-auth-dynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe('Authentication', (): void => {
  describe('default-dynamics', (): void => {
    describe('update-credential', (): void => {
      const credentialKinds: CredentialKind[] = ['email', 'phone']
      const allDisabledOptions: AuthenticationCredentialOptions = {
        enableConfirmation: false,
        enablePasswordCheck: false,
        enableCorroboration: false,
        enableSignUpInvitations: false,

        enforceConfirmation: false,
        enforcePasswordCheck: false,
        enforceSignUpInvitations: false
      }
      const credentialValues = { email: 'DAVID@UNIVERSAL.com', phone: '+524497654321' }

      credentialKinds.forEach((credentialKind: CredentialKind): void => {
        describe(`when updating ${credentialKind}`, (): void => {
          describe('and providing a valid credential', (): void => {
            it('returns success', async (): Promise<void> => {
              const authentication = new Authentication({ [credentialKind]: { ...allDisabledOptions }, secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const authenticatable = TestAuthenticatable.findByCredential(credentialKind)

              const result = await authentication.performDynamic('update-credential', { authenticatable, credential: credentialValues[credentialKind], credentialKind })

              expect(result).toEqual({ status: 'success', authenticatable })
              expect(result.authenticatable[credentialKind]).toEqual(credentialValues[credentialKind].toLowerCase())
              expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable })
            })

            describe(`and ${credentialKind} corroboration is enabled`, (): void => {
              it('returns success', async (): Promise<void> => {
                const authentication = new Authentication(
                  {
                    [credentialKind]: { ...allDisabledOptions, enableCorroboration: true },
                    secret: '123',
                    dynamicsLocation: './src/defaults'
                  },
                  TestAuthenticatable
                )
                authentication.options['namespace'] = 'universal-auth'
                await authentication.loadDynamics()

                const authenticatable = TestAuthenticatable.findByCredential(credentialKind)

                const corroborationToken = authentication.performDynamicSync('encrypt-corroboration', {
                  corroboration: {
                    credential: credentialValues[credentialKind],
                    credentialKind
                  }
                })

                const result = await authentication.performDynamic('update-credential', {
                  authenticatable,
                  credential: credentialValues[credentialKind],
                  credentialKind,
                  corroborationToken
                })

                expect(result).toEqual({ status: 'success', authenticatable })
                expect(result.authenticatable[credentialKind]).toEqual(credentialValues[credentialKind].toLowerCase())
                expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable })
              })

              describe('but the corroboration is not provided', (): void => {
                it('returns failure', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { ...allDisabledOptions, enableCorroboration: true },
                      secret: '123',
                      dynamicsLocation: './src/defaults'
                    },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const authenticatable = TestAuthenticatable.findByCredential(credentialKind)

                  const result = await authentication.performDynamic('update-credential', { authenticatable, credential: credentialValues[credentialKind], credentialKind })

                  expect(result).toEqual({ status: 'failure', message: 'corroboration-required' })
                  expect(SaveAuthenticatableDynamic).not.toHaveBeenPerformed()
                })
              })

              describe('but a invalid corroboration is provided', (): void => {
                it('returns failure', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { ...allDisabledOptions, enableCorroboration: true },
                      secret: '123',
                      dynamicsLocation: './src/defaults'
                    },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const authenticatable = TestAuthenticatable.findByCredential(credentialKind)

                  const result = await authentication.performDynamic('update-credential', {
                    authenticatable,
                    credential: credentialValues[credentialKind],
                    credentialKind,
                    corroborationToken: 'this-is-wrong'
                  })

                  expect(result).toEqual({ status: 'failure', message: 'invalid-corroboration' })
                  expect(SaveAuthenticatableDynamic).not.toHaveBeenPerformed()
                })
              })
            })

            describe(`and ${credentialKind} confirmation is enabled`, (): void => {
              describe(`and current ${credentialKind} is already confirmed`, (): void => {
                it('returns success and sends the confirmation request and sets the unconfirmed credential in the unconfirmed property', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { ...allDisabledOptions, enableConfirmation: true },
                      secret: '123',
                      dynamicsLocation: './src/defaults'
                    },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const authenticatable = TestAuthenticatable.findByCredential(`${credentialKind}.confirmed`)

                  const result = await authentication.performDynamic('update-credential', { authenticatable, credential: credentialValues[credentialKind], credentialKind })

                  expect(result).toEqual({ status: 'success', authenticatable: TestAuthenticatable.lastInstance })
                  expect(authenticatable).toMatchObject({
                    [`unconfirmed${credentialKind.charAt(0).toUpperCase()}${credentialKind.slice(1)}`]: credentialValues[credentialKind].toLowerCase()
                  })
                  expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable })
                  expect(RequestConfirmationDynamic).toHaveBeenPerformedWith({ credential: credentialValues[credentialKind], credentialKind })
                })
              })

              describe(`and current ${credentialKind} is not confirmed`, (): void => {
                it('returns success and sends the confirmation request and sets the unconfirmed credential in the same field', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { ...allDisabledOptions, enableConfirmation: true },
                      secret: '123',
                      dynamicsLocation: './src/defaults'
                    },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const authenticatable = TestAuthenticatable.findByCredential(`${credentialKind}.unconfirmed`)

                  const result = await authentication.performDynamic('update-credential', { authenticatable, credential: credentialValues[credentialKind], credentialKind })

                  expect(result).toEqual({ status: 'success', authenticatable: TestAuthenticatable.lastInstance })
                  expect(authenticatable).toMatchObject({
                    [credentialKind]: credentialValues[credentialKind].toLowerCase()
                  })
                  expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable })
                })
              })

              describe(`and ${credentialKind} corroboration is enabled`, (): void => {
                it('returns success and set as confirmed directly', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { ...allDisabledOptions, enableConfirmation: true, enableCorroboration: true },
                      secret: '123',
                      dynamicsLocation: './src/defaults'
                    },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const authenticatable = TestAuthenticatable.findByCredential(`${credentialKind}.unconfirmed`)

                  const corroborationToken = authentication.performDynamicSync('encrypt-corroboration', {
                    corroboration: {
                      credential: credentialValues[credentialKind],
                      credentialKind
                    }
                  })

                  const result = await authentication.performDynamic('update-credential', {
                    authenticatable,
                    credential: credentialValues[credentialKind],
                    credentialKind,
                    corroborationToken
                  })

                  expect(result).toEqual({ status: 'success', authenticatable: TestAuthenticatable.lastInstance })
                  expect(authenticatable).toMatchObject({
                    [`${credentialKind}ConfirmedAt`]: expect.any(Date)
                  })
                  expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable })
                })
              })
            })
          })

          describe('and providing an invalid credential', (): void => {
            it('returns success', async (): Promise<void> => {
              const authentication = new Authentication({ [credentialKind]: { ...allDisabledOptions }, secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const authenticatable = TestAuthenticatable.findByCredential('any')

              const result = await authentication.performDynamic('update-credential', { authenticatable, credential: 'nop', credentialKind })

              expect(result).toEqual({ status: 'failure', validation: { valid: false, errors: { [credentialKind]: [`invalid-${credentialKind}`] } } })
              expect(SaveAuthenticatableDynamic).not.toHaveBeenPerformed()
            })
          })
        })
      })
    })
  })
})

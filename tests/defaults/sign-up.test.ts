import { Authentication, AuthenticationCredentialOptions, CredentialKind, Invitation } from '../../src'
import ConsumeInvitationDynamic from '../../src/defaults/extended/ConsumeInvitation.universal-auth-dynamic'
import SaveAuthenticatableDynamic from '../../src/defaults/extended/SaveAuthenticatable.universal-auth-dynamic'
import SendWelcomeDynamic from '../../src/defaults/extended/SendWelcome.universal-auth-dynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe(Authentication, (): void => {
  describe('sign-up', (): void => {
    const credentialKinds: CredentialKind[] = ['email', 'phone']
    const allDisabledOptions: AuthenticationCredentialOptions = {
      enableConfirmation: false,
      enablePasswordCheck: false,
      enableCorroboration: false,
      enableSignUp: false,
      enableSignUpInvitations: false,

      enforceConfirmation: false,
      enforcePasswordCheck: false,
      enforceSignUpInvitations: false
    }
    const credentialValues = { email: 'DAVID@UNIVERSAL.com', phone: '+524497654321' }

    credentialKinds.forEach((credentialKind: CredentialKind): void => {
      describe(`when specifying ${credentialKind} to signup`, (): void => {
        describe(`and ${credentialKind} signup is enabled`, (): void => {
          describe('and right signup data is provided', (): void => {
            it('returns success and creates the authenticatable', async (): Promise<void> => {
              const authentication = new Authentication(
                { [credentialKind]: { ...allDisabledOptions, enableSignUp: true }, secret: '123', dynamicsLocation: './src/defaults' },
                TestAuthenticatable
              )
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const result = await authentication.performDynamic('sign-up', {
                attributes: {
                  [credentialKind]: credentialValues[credentialKind],
                  username: 'david',
                  password: '12345678',
                  firstName: 'David',
                  lastName: 'De Anda',
                  name: 'David De Anda'
                },
                credentialKind
              })

              expect(result).toEqual({ status: 'success', authenticatable: TestAuthenticatable.lastInstance })
              expect(TestAuthenticatable.lastInstance).toMatchObject({
                [credentialKind]: credentialValues[credentialKind].toLowerCase(),
                [`${credentialKind}ConfirmedAt`]: null,
                username: 'david',
                firstName: 'David',
                lastName: 'De Anda',
                name: 'David De Anda',
                encryptedPassword: null
              })
              expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
              expect(SendWelcomeDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance, credentialKind })
            })

            describe(`and ${credentialKind} password check is enabled`, (): void => {
              it('returns success and sets the password as well', async (): Promise<void> => {
                const authentication = new Authentication(
                  { [credentialKind]: { ...allDisabledOptions, enableSignUp: true, enablePasswordCheck: true }, secret: '123', dynamicsLocation: './src/defaults' },
                  TestAuthenticatable
                )
                authentication.options['namespace'] = 'universal-auth'
                await authentication.loadDynamics()

                const result = await authentication.performDynamic('sign-up', {
                  attributes: {
                    [credentialKind]: credentialValues[credentialKind],
                    username: 'david',
                    password: '12345678',
                    firstName: 'David',
                    lastName: 'De Anda',
                    name: 'David De Anda'
                  },
                  credentialKind
                })

                expect(result).toEqual({ status: 'success', authenticatable: TestAuthenticatable.lastInstance })
                expect(TestAuthenticatable.lastInstance).toMatchObject({ encryptedPassword: expect.any(String) })
                expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
                expect(SendWelcomeDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance, credentialKind })
              })
            })

            describe(`and ${credentialKind} invitations are enabled`, (): void => {
              it('returns success and sets the inviter', async (): Promise<void> => {
                const authentication = new Authentication(
                  {
                    [credentialKind]: { ...allDisabledOptions, enableSignUp: true, enableSignUpInvitations: true },
                    secret: '123',
                    dynamicsLocation: './src/defaults'
                  },
                  TestAuthenticatable
                )
                authentication.options['namespace'] = 'universal-auth'
                await authentication.loadDynamics()

                const invitation: Invitation = {
                  credential: credentialValues[credentialKind],
                  credentialKind,
                  inviterId: 2
                }

                const invitationToken = authentication.performDynamicSync('encrypt-invitation', {
                  invitation
                })

                const result = await authentication.performDynamic('sign-up', {
                  attributes: {
                    [credentialKind]: credentialValues[credentialKind],
                    username: 'david',
                    password: '12345678',
                    firstName: 'David',
                    lastName: 'De Anda',
                    name: 'David De Anda'
                  },
                  credentialKind,
                  invitationToken
                })

                expect(result).toEqual({ status: 'success', authenticatable: TestAuthenticatable.lastInstance })
                expect(TestAuthenticatable.lastInstance).toMatchObject({
                  [credentialKind]: credentialValues[credentialKind].toLowerCase(),
                  [`${credentialKind}ConfirmedAt`]: null,
                  inviterId: 2
                })
                expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
                expect(ConsumeInvitationDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance, invitation })
                expect(SendWelcomeDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance, credentialKind })
              })

              describe('but an invitation is not provided', (): void => {
                it('returns success and does not set anything', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { ...allDisabledOptions, enableSignUp: true, enableSignUpInvitations: true },
                      secret: '123',
                      dynamicsLocation: './src/defaults'
                    },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const result = await authentication.performDynamic('sign-up', {
                    attributes: {
                      [credentialKind]: credentialValues[credentialKind],
                      username: 'david',
                      password: '12345678',
                      firstName: 'David',
                      lastName: 'De Anda',
                      name: 'David De Anda'
                    },
                    credentialKind
                  })

                  expect(result).toEqual({ status: 'success', authenticatable: TestAuthenticatable.lastInstance })
                  expect(TestAuthenticatable.lastInstance).toMatchObject({
                    [credentialKind]: credentialValues[credentialKind].toLowerCase(),
                    [`${credentialKind}ConfirmedAt`]: null,
                    inviterId: null
                  })
                  expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
                  expect(ConsumeInvitationDynamic).not.toHaveBeenPerformed()
                  expect(SendWelcomeDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance, credentialKind })
                })

                describe(`but ${credentialKind} invitations are enforced`, (): void => {
                  it('returns failure', async (): Promise<void> => {
                    const authentication = new Authentication(
                      {
                        [credentialKind]: { ...allDisabledOptions, enableSignUp: true, enableSignUpInvitations: true, enforceSignUpInvitations: true },
                        secret: '123',
                        dynamicsLocation: './src/defaults'
                      },
                      TestAuthenticatable
                    )
                    authentication.options['namespace'] = 'universal-auth'
                    await authentication.loadDynamics()

                    const result = await authentication.performDynamic('sign-up', {
                      attributes: {
                        [credentialKind]: credentialValues[credentialKind],
                        username: 'david',
                        password: '12345678',
                        firstName: 'David',
                        lastName: 'De Anda',
                        name: 'David De Anda'
                      },
                      credentialKind
                    })

                    expect(result).toEqual({ status: 'failure', message: 'invitation-required' })
                  })
                })
              })

              describe('but a invalid invitation is provided', (): void => {
                it('returns failure', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { ...allDisabledOptions, enableSignUp: true, enableSignUpInvitations: true },
                      secret: '123',
                      dynamicsLocation: './src/defaults'
                    },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const result = await authentication.performDynamic('sign-up', {
                    attributes: {
                      [credentialKind]: credentialValues[credentialKind],
                      username: 'david',
                      password: '12345678',
                      firstName: 'David',
                      lastName: 'De Anda',
                      name: 'David De Anda'
                    },
                    credentialKind,
                    invitationToken: 'this-is-wrong'
                  })

                  expect(result).toEqual({ status: 'failure', message: 'invalid-invitation' })
                })
              })
            })

            describe(`and ${credentialKind} corroboration is enabled`, (): void => {
              it('returns success', async (): Promise<void> => {
                const authentication = new Authentication(
                  {
                    [credentialKind]: { ...allDisabledOptions, enableSignUp: true, enableCorroboration: true },
                    secret: '123',
                    dynamicsLocation: './src/defaults'
                  },
                  TestAuthenticatable
                )
                authentication.options['namespace'] = 'universal-auth'
                await authentication.loadDynamics()

                const corroborationToken = authentication.performDynamicSync('encrypt-corroboration', {
                  corroboration: {
                    credential: credentialValues[credentialKind],
                    credentialKind
                  }
                })

                const result = await authentication.performDynamic('sign-up', {
                  attributes: {
                    [credentialKind]: credentialValues[credentialKind],
                    username: 'david',
                    password: '12345678',
                    firstName: 'David',
                    lastName: 'De Anda',
                    name: 'David De Anda'
                  },
                  credentialKind,
                  corroborationToken
                })

                expect(result).toEqual({ status: 'success', authenticatable: TestAuthenticatable.lastInstance })
                expect(TestAuthenticatable.lastInstance).toMatchObject({
                  [credentialKind]: credentialValues[credentialKind].toLowerCase(),
                  [`${credentialKind}ConfirmedAt`]: null
                })
                expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
                expect(SendWelcomeDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance, credentialKind })
              })

              describe('but the corroboration is not provided', (): void => {
                it('returns failure', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { ...allDisabledOptions, enableSignUp: true, enableCorroboration: true },
                      secret: '123',
                      dynamicsLocation: './src/defaults'
                    },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const result = await authentication.performDynamic('sign-up', {
                    attributes: {
                      [credentialKind]: credentialValues[credentialKind],
                      username: 'david',
                      password: '12345678',
                      firstName: 'David',
                      lastName: 'De Anda',
                      name: 'David De Anda'
                    },
                    credentialKind
                  })

                  expect(result).toEqual({ status: 'failure', message: 'corroboration-required' })
                })
              })

              describe('but a invalid corroboration is provided', (): void => {
                it('returns failure', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { ...allDisabledOptions, enableSignUp: true, enableCorroboration: true },
                      secret: '123',
                      dynamicsLocation: './src/defaults'
                    },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const result = await authentication.performDynamic('sign-up', {
                    attributes: {
                      [credentialKind]: credentialValues[credentialKind],
                      username: 'david',
                      password: '12345678',
                      firstName: 'David',
                      lastName: 'De Anda',
                      name: 'David De Anda'
                    },
                    credentialKind,
                    corroborationToken: 'this-is-wrong'
                  })

                  expect(result).toEqual({ status: 'failure', message: 'invalid-corroboration' })
                })
              })
            })

            describe(`and ${credentialKind} confirmation is enabled`, (): void => {
              it('returns success and sends the confirmation request', async (): Promise<void> => {
                const authentication = new Authentication(
                  {
                    [credentialKind]: { ...allDisabledOptions, enableSignUp: true, enableConfirmation: true },
                    secret: '123',
                    dynamicsLocation: './src/defaults'
                  },
                  TestAuthenticatable
                )
                authentication.options['namespace'] = 'universal-auth'
                await authentication.loadDynamics()

                const result = await authentication.performDynamic('sign-up', {
                  attributes: {
                    [credentialKind]: credentialValues[credentialKind],
                    username: 'david',
                    password: '12345678',
                    firstName: 'David',
                    lastName: 'De Anda',
                    name: 'David De Anda'
                  },
                  credentialKind
                })

                expect(result).toEqual({ status: 'success', authenticatable: TestAuthenticatable.lastInstance })
                expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
                expect(SendWelcomeDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance, credentialKind })
              })

              describe(`and ${credentialKind} invitations are enabled`, (): void => {
                it('returns success and set as confirmed directly', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { ...allDisabledOptions, enableSignUp: true, enableConfirmation: true, enableSignUpInvitations: true },
                      secret: '123',
                      dynamicsLocation: './src/defaults'
                    },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const invitation: Invitation = {
                    inviterId: 2,
                    credential: credentialValues[credentialKind],
                    credentialKind
                  }

                  const invitationToken = authentication.performDynamicSync('encrypt-invitation', {
                    invitation
                  })

                  const result = await authentication.performDynamic('sign-up', {
                    attributes: {
                      [credentialKind]: credentialValues[credentialKind],
                      username: 'david',
                      password: '12345678',
                      firstName: 'David',
                      lastName: 'De Anda',
                      name: 'David De Anda'
                    },
                    credentialKind,
                    invitationToken
                  })

                  expect(result).toEqual({ status: 'success', authenticatable: TestAuthenticatable.lastInstance })
                  expect(TestAuthenticatable.lastInstance).toMatchObject({ [`${credentialKind}ConfirmedAt`]: expect.any(Date) })
                  expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
                  expect(ConsumeInvitationDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance, invitation })
                  expect(SendWelcomeDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance, credentialKind })
                })
              })

              describe(`and ${credentialKind} corroboration is enabled`, (): void => {
                it('returns success and set as confirmed directly', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { ...allDisabledOptions, enableSignUp: true, enableConfirmation: true, enableCorroboration: true },
                      secret: '123',
                      dynamicsLocation: './src/defaults'
                    },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const corroborationToken = authentication.performDynamicSync('encrypt-corroboration', {
                    corroboration: {
                      credential: credentialValues[credentialKind],
                      credentialKind
                    }
                  })

                  const result = await authentication.performDynamic('sign-up', {
                    attributes: {
                      [credentialKind]: credentialValues[credentialKind],
                      username: 'david',
                      password: '12345678',
                      firstName: 'David',
                      lastName: 'De Anda',
                      name: 'David De Anda'
                    },
                    credentialKind,
                    corroborationToken
                  })

                  expect(result).toEqual({ status: 'success', authenticatable: TestAuthenticatable.lastInstance })
                  expect(TestAuthenticatable.lastInstance).toMatchObject({ [`${credentialKind}ConfirmedAt`]: expect.any(Date) })
                  expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
                  expect(SendWelcomeDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance, credentialKind })
                })
              })

              describe(`but ${credentialKind} confirmation is enforced`, (): void => {
                it('returns warning about the confirmation needed', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { ...allDisabledOptions, enableSignUp: true, enableConfirmation: true, enforceConfirmation: true },
                      secret: '123',
                      dynamicsLocation: './src/defaults'
                    },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const result = await authentication.performDynamic('sign-up', {
                    attributes: {
                      [credentialKind]: credentialValues[credentialKind],
                      username: 'david',
                      password: '12345678',
                      firstName: 'David',
                      lastName: 'De Anda',
                      name: 'David De Anda'
                    },
                    credentialKind
                  })

                  expect(result).toEqual({
                    status: 'warning',
                    message: 'confirmation-inbound',
                    metadata: { credential: credentialValues[credentialKind].toLowerCase(), credentialKind }
                  })
                  expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
                  expect(SendWelcomeDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance, credentialKind })
                })
              })
            })
          })

          describe('and invalid signup data is provided', (): void => {
            it('returns failure and the validation object', async (): Promise<void> => {
              const authentication = new Authentication(
                { [credentialKind]: { ...allDisabledOptions, enableSignUp: true }, secret: '123', dynamicsLocation: './src/defaults' },
                TestAuthenticatable
              )
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const result = await authentication.performDynamic('sign-up', {
                attributes: {
                  [credentialKind]: 'nop',
                  username: '',
                  password: '1',
                  firstName: 'David',
                  lastName: 'De Anda',
                  name: 'David De Anda'
                },
                credentialKind
              })

              expect(result).toEqual({
                status: 'failure',
                validation: {
                  errors: {
                    [credentialKind]: [`invalid-${credentialKind}`],
                    username: ['invalid-username']
                  },
                  valid: false
                }
              })
              expect(SaveAuthenticatableDynamic).not.toHaveBeenPerformed()
            })

            describe(`and ${credentialKind} password check is enabled`, (): void => {
              it('returns failure and validates the password as well', async (): Promise<void> => {
                const authentication = new Authentication(
                  { [credentialKind]: { ...allDisabledOptions, enableSignUp: true, enablePasswordCheck: true }, secret: '123', dynamicsLocation: './src/defaults' },
                  TestAuthenticatable
                )
                authentication.options['namespace'] = 'universal-auth'
                await authentication.loadDynamics()

                const result = await authentication.performDynamic('sign-up', {
                  attributes: {
                    [credentialKind]: 'nop',
                    username: '',
                    password: '1',
                    firstName: 'David',
                    lastName: 'De Anda',
                    name: 'David De Anda'
                  },
                  credentialKind
                })

                expect(result).toEqual({
                  status: 'failure',
                  validation: {
                    errors: {
                      [credentialKind]: [`invalid-${credentialKind}`],
                      username: ['invalid-username'],
                      password: ['password-out-of-size']
                    },
                    valid: false
                  }
                })
              })

              describe('but password is not provided', (): void => {
                it('ignores password validation', async (): Promise<void> => {
                  const authentication = new Authentication(
                    { [credentialKind]: { ...allDisabledOptions, enableSignUp: true, enablePasswordCheck: true }, secret: '123', dynamicsLocation: './src/defaults' },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const result = await authentication.performDynamic('sign-up', {
                    attributes: {
                      [credentialKind]: 'nop',
                      username: '',
                      firstName: 'David',
                      lastName: 'De Anda',
                      name: 'David De Anda'
                    },
                    credentialKind
                  })

                  expect(result).toEqual({
                    status: 'failure',
                    validation: {
                      errors: {
                        [credentialKind]: [`invalid-${credentialKind}`],
                        username: ['invalid-username']
                      },
                      valid: false
                    }
                  })
                })

                describe(`but ${credentialKind} password check is enforced`, (): void => {
                  it('validates password as well', async (): Promise<void> => {
                    const authentication = new Authentication(
                      {
                        [credentialKind]: { ...allDisabledOptions, enableSignUp: true, enablePasswordCheck: true, enforcePasswordCheck: true },
                        secret: '123',
                        dynamicsLocation: './src/defaults'
                      },
                      TestAuthenticatable
                    )
                    authentication.options['namespace'] = 'universal-auth'
                    await authentication.loadDynamics()

                    const result = await authentication.performDynamic('sign-up', {
                      attributes: {
                        [credentialKind]: 'nop',
                        username: '',
                        firstName: 'David',
                        lastName: 'De Anda',
                        name: 'David De Anda'
                      },
                      credentialKind
                    })

                    expect(result).toEqual({
                      status: 'failure',
                      validation: {
                        errors: {
                          [credentialKind]: [`invalid-${credentialKind}`],
                          username: ['invalid-username'],
                          password: ['password-out-of-size']
                        },
                        valid: false
                      }
                    })
                  })
                })
              })
            })
          })
        })

        describe(`and ${credentialKind} signup is disabled`, (): void => {
          it('returns failure', async (): Promise<void> => {
            const authentication = new Authentication({ [credentialKind]: { ...allDisabledOptions }, secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
            authentication.options['namespace'] = 'universal-auth'
            await authentication.loadDynamics()

            const result = await authentication.performDynamic('sign-up', {
              attributes: {
                [credentialKind]: credentialValues[credentialKind],
                username: 'david',
                password: '12345678',
                firstName: 'David',
                lastName: 'De Anda',
                name: 'David De Anda'
              },
              credentialKind
            })

            expect(result).toEqual({ status: 'failure', message: 'sign-up-disabled' })
          })
        })
      })
    })
  })
})

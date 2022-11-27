import { Authentication, AuthenticationCredentialOptions, CredentialKind } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe('Authentication', (): void => {
  describe('default-dynamics', (): void => {
    describe('sign-up', (): void => {
      const credentialKinds: CredentialKind[] = ['email', 'phone']
      const allDisabledOptions: AuthenticationCredentialOptions = {
        enableConfirmation: false,
        enablePasswordCheck: false,
        enableSignUpCorroboration: false,
        enableSignUpInvitations: false,

        enforceConfirmation: false,
        enforcePasswordCheck: false,
        enforceSignUpInvitations: false
      }
      const credentialValues = { email: 'DAVID@UNIVERSAL.com', phone: '+524497654321' }

      credentialKinds.forEach((credentialKind: CredentialKind): void => {
        describe(`when specifying ${credentialKind} to signup in`, (): void => {
          describe('and right signup data is provided', (): void => {
            it('returns success and creates the authenticatable', async (): Promise<void> => {
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

              expect(result).toEqual({ status: 'success', authenticatable: TestAuthenticatable.lastInstance })
              expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
              expect(TestAuthenticatable.lastInstance).toMatchObject({
                [credentialKind]: credentialValues[credentialKind].toLowerCase(),
                [`${credentialKind}ConfirmedAt`]: null,
                username: 'david',
                firstName: 'David',
                lastName: 'De Anda',
                name: 'David De Anda',
                encryptedPassword: null
              })
            })

            describe(`and ${credentialKind} password check is enabled`, (): void => {
              it('returns success and sets the password as well', async (): Promise<void> => {
                const authentication = new Authentication(
                  { [credentialKind]: { ...allDisabledOptions, enablePasswordCheck: true }, secret: '123', dynamicsLocation: './src/defaults' },
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
              })
            })

            describe(`and ${credentialKind} invitations are enabled`, (): void => {
              it('returns success and sets the inviter', async (): Promise<void> => {
                const authentication = new Authentication(
                  {
                    [credentialKind]: { ...allDisabledOptions, enableSignUpInvitations: true },
                    secret: '123',
                    dynamicsLocation: './src/defaults'
                  },
                  TestAuthenticatable
                )
                authentication.options['namespace'] = 'universal-auth'
                await authentication.loadDynamics()

                const invitationToken = authentication.performDynamicSync('encrypt-invitation', {
                  credential: credentialValues[credentialKind],
                  credentialKind,
                  invitation: { credential: credentialValues[credentialKind], credentialKind, inviterId: 2 }
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
                expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
                expect(TestAuthenticatable.lastInstance).toMatchObject({
                  [credentialKind]: credentialValues[credentialKind].toLowerCase(),
                  [`${credentialKind}ConfirmedAt`]: null,
                  inviterId: 2
                })
              })

              describe('but an invitation is not provided', (): void => {
                it('returns success and does not set anything', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { ...allDisabledOptions, enableSignUpInvitations: true },
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
                  expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
                  expect(TestAuthenticatable.lastInstance).toMatchObject({
                    [credentialKind]: credentialValues[credentialKind].toLowerCase(),
                    [`${credentialKind}ConfirmedAt`]: null,
                    inviterId: null
                  })
                })

                describe(`but ${credentialKind} invitations are enforced`, (): void => {
                  it('returns failure', async (): Promise<void> => {
                    const authentication = new Authentication(
                      {
                        [credentialKind]: { ...allDisabledOptions, enableSignUpInvitations: true, enforceSignUpInvitations: true },
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

              describe('but the invitation is not for this kind of credential', (): void => {
                it('returns failure', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { ...allDisabledOptions, enableSignUpInvitations: true },
                      secret: '123',
                      dynamicsLocation: './src/defaults'
                    },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const invitationToken = authentication.performDynamicSync('encrypt-invitation', {
                    invitation: { credential: credentialValues[credentialKind], credentialKind: 'another' as any, inviterId: 2 },
                    credential: credentialValues[credentialKind],
                    credentialKind: 'another' as any
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

                  expect(result).toEqual({ status: 'failure', message: 'invalid-invitation' })
                })
              })

              describe('but a invalid invitation is provided', (): void => {
                it('returns failure', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { ...allDisabledOptions, enableSignUpInvitations: true },
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
                    [credentialKind]: { ...allDisabledOptions, enableSignUpCorroboration: true },
                    secret: '123',
                    dynamicsLocation: './src/defaults'
                  },
                  TestAuthenticatable
                )
                authentication.options['namespace'] = 'universal-auth'
                await authentication.loadDynamics()

                const corroborationToken = authentication.performDynamicSync('encrypt-corroboration', {
                  corroboration: { credential: credentialValues[credentialKind], credentialKind },
                  credential: credentialValues[credentialKind],
                  credentialKind
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
                expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
                expect(TestAuthenticatable.lastInstance).toMatchObject({
                  [credentialKind]: credentialValues[credentialKind].toLowerCase(),
                  [`${credentialKind}ConfirmedAt`]: null
                })
              })

              describe('but the corroboration is not provided', (): void => {
                it('returns failure', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { ...allDisabledOptions, enableSignUpCorroboration: true },
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

              describe('but the corroboration is not for this kind of credential', (): void => {
                it('returns failure', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { ...allDisabledOptions, enableSignUpCorroboration: true },
                      secret: '123',
                      dynamicsLocation: './src/defaults'
                    },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const corroborationToken = authentication.performDynamicSync('encrypt-corroboration', {
                    corroboration: { credential: credentialValues[credentialKind], credentialKind: 'another' as any },
                    credential: credentialValues[credentialKind],
                    credentialKind: 'another' as any
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

                  expect(result).toEqual({ status: 'failure', message: 'invalid-corroboration' })
                })
              })

              describe('but a invalid corroboration is provided', (): void => {
                it('returns failure', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { ...allDisabledOptions, enableSignUpCorroboration: true },
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
                    [credentialKind]: { ...allDisabledOptions, enableConfirmation: true },
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
                expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
              })

              describe(`and ${credentialKind} invitations are enabled`, (): void => {
                it('returns success and set as confirmed directly', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { ...allDisabledOptions, enableConfirmation: true, enableSignUpInvitations: true },
                      secret: '123',
                      dynamicsLocation: './src/defaults'
                    },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const invitationToken = authentication.performDynamicSync('encrypt-invitation', {
                    invitation: { inviterId: 2, credential: credentialValues[credentialKind], credentialKind },
                    credential: credentialValues[credentialKind],
                    credentialKind
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
                  expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
                  expect(TestAuthenticatable.lastInstance).toMatchObject({ [`${credentialKind}ConfirmedAt`]: expect.any(Date) })
                })
              })

              describe(`and ${credentialKind} corroboration is enabled`, (): void => {
                it('returns success and set as confirmed directly', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { ...allDisabledOptions, enableConfirmation: true, enableSignUpCorroboration: true },
                      secret: '123',
                      dynamicsLocation: './src/defaults'
                    },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const corroborationToken = authentication.performDynamicSync('encrypt-corroboration', {
                    corroboration: { credential: credentialValues[credentialKind], credentialKind },
                    credential: credentialValues[credentialKind],
                    credentialKind
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
                  expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
                  expect(TestAuthenticatable.lastInstance).toMatchObject({ [`${credentialKind}ConfirmedAt`]: expect.any(Date) })
                })
              })

              describe(`but ${credentialKind} confirmation is enforced`, (): void => {
                it('returns warning about the confirmation needed', async (): Promise<void> => {
                  const authentication = new Authentication(
                    {
                      [credentialKind]: { ...allDisabledOptions, enableConfirmation: true, enforceConfirmation: true },
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
                  expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
                })
              })
            })
          })

          describe('and invalid signup data is provided', (): void => {
            it('returns failure and the validation object', async (): Promise<void> => {
              const authentication = new Authentication({ [credentialKind]: { ...allDisabledOptions }, secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
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
            })

            describe(`and ${credentialKind} password check is enabled`, (): void => {
              it('returns failure and validates the password as well', async (): Promise<void> => {
                const authentication = new Authentication(
                  { [credentialKind]: { ...allDisabledOptions, enablePasswordCheck: true }, secret: '123', dynamicsLocation: './src/defaults' },
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
                    { [credentialKind]: { ...allDisabledOptions, enablePasswordCheck: true }, secret: '123', dynamicsLocation: './src/defaults' },
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
                      { [credentialKind]: { ...allDisabledOptions, enablePasswordCheck: true, enforcePasswordCheck: true }, secret: '123', dynamicsLocation: './src/defaults' },
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
      })
    })
  })
})

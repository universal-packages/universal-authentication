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

        enforceSignUpInvitations: false
      }
      const credentialValues = { email: 'DAVID@UNIVERSAL.com', phone: '+524491234567' }

      credentialKinds.forEach((credentialKind: CredentialKind): void => {
        describe(`when specifying ${credentialKind} to signup in`, (): void => {
          describe('and right signup data is provided', (): void => {
            it('returns success and creates the authenticatable', async (): Promise<void> => {
              const authentication = new Authentication({ [credentialKind]: { ...allDisabledOptions }, secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const result = await authentication.performDynamic('sign-up', {
                credentialKind,
                [credentialKind]: credentialValues[credentialKind],
                username: 'david',
                password: '12345678',
                firstName: 'David',
                lastName: 'De Anda',
                name: 'David De Anda'
              })

              expect(result).toEqual({ status: 'success', authenticatable: TestAuthenticatable.lastInstance })
              expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
              expect(TestAuthenticatable.lastInstance).toMatchObject({
                [credentialKind]: credentialValues[credentialKind].toLocaleLowerCase(),
                [`${credentialKind}ConfirmedAt`]: null,
                username: 'david',
                encryptedPassword: expect.any(String),
                firstName: 'David',
                lastName: 'De Anda',
                name: 'David De Anda'
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

                const invitationToken = authentication.performDynamicSync('encrypt-invitation-payload', {
                  inviterId: 2,
                  credential: credentialValues[credentialKind],
                  credentialKind
                })

                const result = await authentication.performDynamic('sign-up', {
                  credentialKind,
                  [credentialKind]: credentialValues[credentialKind],
                  username: 'david',
                  password: '12345678',
                  firstName: 'David',
                  lastName: 'De Anda',
                  name: 'David De Anda',
                  invitationToken
                })

                expect(result).toEqual({ status: 'success', authenticatable: TestAuthenticatable.lastInstance })
                expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
                expect(TestAuthenticatable.lastInstance).toMatchObject({
                  [credentialKind]: credentialValues[credentialKind].toLocaleLowerCase(),
                  [`${credentialKind}ConfirmedAt`]: null,
                  inviterId: '2'
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
                    credentialKind,
                    [credentialKind]: credentialValues[credentialKind],
                    username: 'david',
                    password: '12345678',
                    firstName: 'David',
                    lastName: 'De Anda',
                    name: 'David De Anda'
                  })

                  expect(result).toEqual({ status: 'success', authenticatable: TestAuthenticatable.lastInstance })
                  expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
                  expect(TestAuthenticatable.lastInstance).toMatchObject({
                    [credentialKind]: credentialValues[credentialKind].toLocaleLowerCase(),
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
                      credentialKind,
                      [credentialKind]: credentialValues[credentialKind],
                      username: 'david',
                      password: '12345678',
                      firstName: 'David',
                      lastName: 'De Anda',
                      name: 'David De Anda'
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

                  const invitationToken = authentication.performDynamicSync('encrypt-invitation-payload', {
                    inviterId: 2,
                    credential: credentialValues[credentialKind],
                    credentialKind: 'another' as any
                  })

                  const result = await authentication.performDynamic('sign-up', {
                    credentialKind,
                    [credentialKind]: credentialValues[credentialKind],
                    username: 'david',
                    password: '12345678',
                    firstName: 'David',
                    lastName: 'De Anda',
                    name: 'David De Anda',
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
                    credentialKind,
                    [credentialKind]: credentialValues[credentialKind],
                    username: 'david',
                    password: '12345678',
                    firstName: 'David',
                    lastName: 'De Anda',
                    name: 'David De Anda',
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

                const corroborationToken = authentication.performDynamicSync('encrypt-corroboration-payload', {
                  credential: credentialValues[credentialKind],
                  credentialKind
                })

                const result = await authentication.performDynamic('sign-up', {
                  credentialKind,
                  [credentialKind]: credentialValues[credentialKind],
                  username: 'david',
                  password: '12345678',
                  firstName: 'David',
                  lastName: 'De Anda',
                  name: 'David De Anda',
                  corroborationToken
                })

                expect(result).toEqual({ status: 'success', authenticatable: TestAuthenticatable.lastInstance })
                expect(TestAuthenticatable.lastInstance.save).toHaveBeenCalled()
                expect(TestAuthenticatable.lastInstance).toMatchObject({
                  [credentialKind]: credentialValues[credentialKind].toLocaleLowerCase(),
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
                    credentialKind,
                    [credentialKind]: credentialValues[credentialKind],
                    username: 'david',
                    password: '12345678',
                    firstName: 'David',
                    lastName: 'De Anda',
                    name: 'David De Anda'
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

                  const corroborationToken = authentication.performDynamicSync('encrypt-corroboration-payload', {
                    credential: credentialValues[credentialKind],
                    credentialKind: 'another' as any
                  })

                  const result = await authentication.performDynamic('sign-up', {
                    credentialKind,
                    [credentialKind]: credentialValues[credentialKind],
                    username: 'david',
                    password: '12345678',
                    firstName: 'David',
                    lastName: 'De Anda',
                    name: 'David De Anda',
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
                    credentialKind,
                    [credentialKind]: credentialValues[credentialKind],
                    username: 'david',
                    password: '12345678',
                    firstName: 'David',
                    lastName: 'De Anda',
                    name: 'David De Anda',
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
                  credentialKind,
                  [credentialKind]: credentialValues[credentialKind],
                  username: 'david',
                  password: '12345678',
                  firstName: 'David',
                  lastName: 'De Anda',
                  name: 'David De Anda'
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

                  const invitationToken = authentication.performDynamicSync('encrypt-invitation-payload', {
                    inviterId: 2,
                    credential: credentialValues[credentialKind],
                    credentialKind
                  })

                  const result = await authentication.performDynamic('sign-up', {
                    credentialKind,
                    [credentialKind]: credentialValues[credentialKind],
                    username: 'david',
                    password: '12345678',
                    firstName: 'David',
                    lastName: 'De Anda',
                    name: 'David De Anda',
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

                  const corroborationToken = authentication.performDynamicSync('encrypt-corroboration-payload', {
                    credential: credentialValues[credentialKind],
                    credentialKind
                  })

                  const result = await authentication.performDynamic('sign-up', {
                    credentialKind,
                    [credentialKind]: credentialValues[credentialKind],
                    username: 'david',
                    password: '12345678',
                    firstName: 'David',
                    lastName: 'De Anda',
                    name: 'David De Anda',
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
                    credentialKind,
                    [credentialKind]: credentialValues[credentialKind],
                    username: 'david',
                    password: '12345678',
                    firstName: 'David',
                    lastName: 'De Anda',
                    name: 'David De Anda'
                  })

                  expect(result).toEqual({ status: 'warning', message: 'confirmation-inbound' })
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
                credentialKind,
                [credentialKind]: 'nop',
                username: '',
                password: '1',
                firstName: 'David',
                lastName: 'De Anda',
                name: 'David De Anda'
              })

              expect(result).toEqual({
                status: 'failure',
                validation: {
                  errors: {
                    [credentialKind]: [`invalid-${credentialKind}`],
                    password: ['password-out-of-size'],
                    username: ['invalid-username']
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

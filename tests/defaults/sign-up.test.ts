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
          describe('providing right signup data is provided', (): void => {
            it('returns success and creates the authenticatable', async (): Promise<void> => {
              const credentialKindOptions: AuthenticationCredentialOptions = { ...allDisabledOptions }
              const authentication = new Authentication(
                { [credentialKind]: credentialKindOptions, secret: '123', dynamicsLocation: './src/defaults' },
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
                username: 'david',
                encryptedPassword: expect.any(String),
                firstName: 'David',
                lastName: 'De Anda',
                name: 'David De Anda'
              })
            })
          })
        })
      })
    })
  })
})

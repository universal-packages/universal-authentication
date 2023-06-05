import { Authentication, CredentialKind } from '../../src'
import SendInvitationDynamic from '../../src/defaults/extended/SendInvitation.universal-auth-dynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe('Authentication', (): void => {
  describe('default-dynamics', (): void => {
    describe('invite-authenticatable', (): void => {
      const credentialKinds: CredentialKind[] = ['email', 'phone']

      credentialKinds.forEach((credentialKind: CredentialKind): void => {
        describe(`when using ${credentialKind} to invite`, (): void => {
          describe('and sign up invitations are enabled', (): void => {
            it('returns success', async (): Promise<void> => {
              const authentication = new Authentication(
                {
                  [credentialKind]: { enableSignUpInvitations: true },
                  secret: '123',
                  dynamicsLocation: './src/defaults'
                },
                TestAuthenticatable
              )
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const result = await authentication.performDynamic('invite-authenticatable', { credential: 'credential', credentialKind, inviterId: 2, metadata: { foo: 'bar' } })

              expect(result).toEqual({ status: 'success' })
              expect(SendInvitationDynamic).toHaveBeenPerformedWith({ credential: 'credential', credentialKind, invitationToken: expect.any(String) })
            })
          })

          describe('and sign up invitations are not enabled', (): void => {
            it('returns failure', async (): Promise<void> => {
              const authentication = new Authentication(
                {
                  [credentialKind]: { enableSignUpInvitations: false },
                  secret: '123',
                  dynamicsLocation: './src/defaults'
                },
                TestAuthenticatable
              )
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const result = await authentication.performDynamic('invite-authenticatable', { credential: 'credential', credentialKind, inviterId: 2 })

              expect(result).toEqual({ status: 'failure', message: 'invitations-disabled' })
              expect(SendInvitationDynamic).not.toHaveBeenPerformed()
            })
          })
        })
      })
    })
  })
})

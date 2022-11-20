import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, InviteAuthenticatablePayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('invite-authenticatable', true)
export default class InviteAuthenticatableDynamic {
  public perform(payload: InviteAuthenticatablePayload, authentication: Authentication): AuthenticationResult {
    const { credential, credentialKind, inviterId } = payload
    const credentialKindOptions = authentication.options[credentialKind]

    if (credentialKindOptions.enableSignUpInvitations) {
      const invitationToken = authentication.performDynamicSync('encrypt-invitation', { credential, credentialKind, invitation: { credential, credentialKind, inviterId } })

      authentication.performDynamic('send-invitation', { credential, credentialKind, invitationToken })

      return { status: 'success', metadata: { invitationToken } }
    } else {
      return { status: 'failure', message: 'invitations-disabled' }
    }
  }
}

import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, AuthenticationResult, InviteAuthenticatablePayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('invite-authenticatable', true)
export default class InviteAuthenticatableDynamic {
  public perform(payload: InviteAuthenticatablePayload, authentication: Authentication): AuthenticationResult {
    const { credential, credentialKind, inviterId, metadata } = payload
    const credentialKindOptions = authentication.options[credentialKind]

    if (credentialKindOptions.enableSignUpInvitations) {
      const invitationToken = authentication.performDynamicSync('encrypt-invitation', { invitation: { credential, credentialKind, inviterId, metadata } })

      authentication.performDynamic('send-invitation', { credential, credentialKind, invitationToken })

      return { status: 'success' }
    } else {
      return { status: 'failure', message: 'invitations-disabled' }
    }
  }
}

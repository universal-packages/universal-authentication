import Authentication from '../Authentication'
import { AuthDynamicNames, AuthDynamicPayload, AuthenticationResult, InvitationPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('invite', true)
export default class InviteDynamic {
  public perform(payload: AuthDynamicPayload<InvitationPayload>, authentication: Authentication): AuthenticationResult {
    const { credential, credentialKind, inviterId } = payload.body

    if (payload.authOptions[credentialKind].enforceSignUpInvitations) {
      const corroborationToken = authentication.performDynamicSync('encrypt-invitation-payload', { credential, credentialKind, inviterId })

      return { status: 'success', metadata: { corroborationToken } }
    } else {
      return { status: 'failure', message: 'invitations-disabled' }
    }
  }
}

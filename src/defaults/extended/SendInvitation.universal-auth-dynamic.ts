import Authentication from '../../Authentication'
import { AuthDynamicNames, SendInvitationPayload } from '../../types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('send-invitation', true)
export default class SendInvitationDynamic {
  public async perform(payload: SendInvitationPayload, authentication: Authentication): Promise<void> {
    const { credential, credentialKind, invitationToken } = payload

    authentication.emit('warning', { credential, credentialKind, invitationToken, dynamic: this.constructor.name, message: 'not implemented' })
  }
}

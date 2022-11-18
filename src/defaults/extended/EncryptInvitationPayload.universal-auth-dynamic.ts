import Authentication from '../../Authentication'
import { AuthDynamicNames, EncryptInvitationPayload } from '../../Authentication.types'
import { encryptSubject } from '../../crypto'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('encrypt-invitation', true)
export default class EncryptInvitationPayloadDynamic {
  public perform(payload: EncryptInvitationPayload, authentication: Authentication): string {
    const { credential, credentialKind, invitation } = payload

    const secret = authentication.performDynamicSync('generate-concern-secret', { concern: 'invitation', credential, credentialKind })

    return encryptSubject(invitation, secret)
  }
}

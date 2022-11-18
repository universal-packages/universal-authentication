import Authentication from '../../Authentication'
import { AuthDynamicNames, DecryptInvitationTokenPayload, Invitation } from '../../Authentication.types'
import { decryptSubject } from '../../crypto'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('decrypt-invitation-token', true)
export default class DecryptInvitationTokenDynamic {
  public perform(payload: DecryptInvitationTokenPayload, authentication: Authentication): Invitation {
    const { credential, credentialKind, token } = payload

    if (!token) return

    const secret = authentication.performDynamicSync('generate-concern-secret', { concern: 'invitation', credential, credentialKind })

    return decryptSubject(token, secret)
  }
}

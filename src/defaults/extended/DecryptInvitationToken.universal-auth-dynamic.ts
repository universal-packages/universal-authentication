import { decryptSubject } from '@universal-packages/crypto-utils'
import Authentication from '../../Authentication'
import { AuthDynamicNames, DecryptInvitationTokenPayload, Invitation } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('decrypt-invitation-token', true)
export default class DecryptInvitationTokenDynamic {
  public perform(payload: DecryptInvitationTokenPayload, authentication: Authentication): Invitation {
    const { credential, credentialKind, token } = payload

    if (!token) return

    const secret = authentication.performDynamicSync('generate-concern-secret', { concern: 'invitation', credential, credentialKind })

    return decryptSubject(token, secret, { concern: 'invitation' })
  }
}

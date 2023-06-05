import { decryptSubject } from '@universal-packages/crypto-utils'

import Authentication from '../../Authentication'
import { AuthDynamicNames, DecryptInvitationTokenPayload, Invitation } from '../../types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('decrypt-invitation-token', true)
export default class DecryptInvitationTokenDynamic {
  public perform(payload: DecryptInvitationTokenPayload, authentication: Authentication): Invitation {
    const { token } = payload

    if (!token) return

    return decryptSubject(token, authentication.options.secret, { concern: 'invitation' })
  }
}

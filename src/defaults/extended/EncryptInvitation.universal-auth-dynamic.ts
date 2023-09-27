import { encryptSubject } from '@universal-packages/crypto-utils'

import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, EncryptInvitationPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('encrypt-invitation', true)
export default class EncryptInvitationDynamic {
  public perform(payload: EncryptInvitationPayload, authentication: Authentication): string {
    const { invitation } = payload

    return encryptSubject(invitation, authentication.options.secret, { concern: 'invitation' })
  }
}

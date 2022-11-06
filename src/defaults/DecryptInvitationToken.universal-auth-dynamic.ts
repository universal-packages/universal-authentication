import { AuthDynamicNames, AuthDynamicPayload, InvitationPayload, TokenPayload } from '../Authentication.types'
import { decryptSubject } from '../crypto'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('decrypt-invitation-token', true)
export default class DecryptTokenDynamic {
  public perform(payload: AuthDynamicPayload<TokenPayload>): InvitationPayload {
    if (!payload.body.token) return

    const decryptedPayload: InvitationPayload = decryptSubject(payload.body.token, payload.authOptions.secret)

    decryptedPayload.inviterId = BigInt(decryptedPayload.inviterId)

    return decryptedPayload
  }
}

import { AuthDynamicNames, AuthDynamicPayload, InvitationPayload, TokenPayload } from '../Authentication.types'
import { decryptSubject } from '../crypto'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('decrypt-corroboration-token', true)
export default class DecryptCorroborationTokenDynamic {
  public perform(payload: AuthDynamicPayload<TokenPayload>): InvitationPayload {
    if (!payload.body.token) return

    const decryptedPayload: InvitationPayload = decryptSubject(payload.body.token, payload.authOptions.secret)

    return decryptedPayload
  }
}

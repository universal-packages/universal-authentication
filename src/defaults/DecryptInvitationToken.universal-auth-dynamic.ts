import { AuthDynamicPayload, InvitationPayload, TokenPayload } from '../Authentication.types'
import { decryptSubject } from '../crypto'
import { AuthDynamic } from '../decorators'

@AuthDynamic('decrypt=invitation-token', true)
export default class DecryptTokenDynamic {
  public perform(payload: AuthDynamicPayload<TokenPayload>): InvitationPayload {
    return decryptSubject(payload.body.token, payload.authOptions.encryptionSecret)
  }
}

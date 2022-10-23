import { AuthDynamicPayload, InvitationPayload, TokenBody } from '../Authentication.types'
import { decryptSubject } from '../crypto'
import { AuthDynamic } from '../decorators'

@AuthDynamic('decrypt=invitation-token', true)
export default class DecryptTokenDynamic {
  public perform(payload: AuthDynamicPayload<TokenBody>): InvitationPayload {
    return decryptSubject(payload.body.token, payload.authOptions.encryptionSecret)
  }
}

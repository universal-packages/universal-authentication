import { AuthDynamicPayload, InvitationPayload } from '../Authentication.types'
import { encryptSubject } from '../crypto'
import { AuthDynamic } from '../decorators'

@AuthDynamic('encrypt-invitation-payload', true)
export default class EncryptTokenDynamic {
  public perform(payload: AuthDynamicPayload<InvitationPayload>): string {
    return encryptSubject(payload.body, payload.authOptions.encryptionSecret)
  }
}

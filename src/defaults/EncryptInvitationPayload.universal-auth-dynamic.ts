import { AuthDynamicNames, AuthDynamicPayload, InvitationPayload } from '../Authentication.types'
import { encryptSubject } from '../crypto'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('encrypt-invitation-payload', true)
export default class EncryptTokenDynamic {
  public perform(payload: AuthDynamicPayload<InvitationPayload>): string {
    const suitablePayload: Record<string, any> = { ...payload.body }

    suitablePayload.inviterId = String(suitablePayload.inviterId)

    return encryptSubject(suitablePayload, payload.authOptions.secret)
  }
}

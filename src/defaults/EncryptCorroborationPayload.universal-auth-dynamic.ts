import { AuthDynamicNames, AuthDynamicPayload, CorroborationPayload } from '../Authentication.types'
import { encryptSubject } from '../crypto'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('encrypt-corroboration-payload', true)
export default class EncryptCorroborationPayloadDynamic {
  public perform(payload: AuthDynamicPayload<CorroborationPayload>): string {
    return encryptSubject(payload.body, payload.authOptions.secret)
  }
}

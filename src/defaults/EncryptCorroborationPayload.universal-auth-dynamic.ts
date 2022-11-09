import { AuthDynamicNames, AuthDynamicPayload, CredentialAndKindPayload } from '../Authentication.types'
import { encryptSubject } from '../crypto'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('encrypt-corroboration-payload', true)
export default class EncryptCorroborationPayloadDynamic {
  public perform(payload: AuthDynamicPayload<CredentialAndKindPayload>): string {
    return encryptSubject(payload.body, payload.authOptions.secret)
  }
}

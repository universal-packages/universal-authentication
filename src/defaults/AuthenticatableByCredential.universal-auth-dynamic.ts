import { Authenticatable, CredentialBody, AuthDynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('authenticatable-by-credential', true)
export default class AuthenticatableByCredentialDynamic {
  public async perform(payload: AuthDynamicPayload<CredentialBody>): Promise<Authenticatable> {
    const Authenticatable = payload.Authenticatable
    const authenticatable = await Authenticatable.findByCredential(payload.body.credential)

    return authenticatable
  }
}

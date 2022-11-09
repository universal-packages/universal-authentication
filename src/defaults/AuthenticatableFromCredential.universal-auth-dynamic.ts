import { Authenticatable, AuthDynamicPayload, CredentialPayload, AuthDynamicNames } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('authenticatable-from-credential', true)
export default class AuthenticatableFromCredentialDynamic {
  public async perform(payload: AuthDynamicPayload<CredentialPayload>): Promise<Authenticatable> {
    const Authenticatable = payload.Authenticatable
    const authenticatable = await Authenticatable.findByCredential(payload.body.credential)

    return authenticatable
  }
}

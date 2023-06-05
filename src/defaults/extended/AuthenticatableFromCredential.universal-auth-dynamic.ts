import Authentication from '../../Authentication'
import { AuthDynamicNames, Authenticatable, AuthenticatableFromCredentialPayload } from '../../types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('authenticatable-from-credential', true)
export default class AuthenticatableFromCredentialDynamic {
  public async perform(payload: AuthenticatableFromCredentialPayload, authentication: Authentication): Promise<Authenticatable> {
    const Authenticatable = authentication.Authenticatable
    const authenticatable = await Authenticatable.findByCredential(payload.credential)

    return authenticatable
  }
}

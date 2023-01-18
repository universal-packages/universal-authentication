import Authentication from '../../Authentication'
import { Authenticatable, AuthDynamicNames, AuthenticatableFromIdPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('authenticatable-from-id', true)
export default class AuthenticatableFromIdDynamic {
  public async perform(payload: AuthenticatableFromIdPayload, authentication: Authentication): Promise<Authenticatable> {
    const Authenticatable = authentication.Authenticatable
    const authenticatable = await Authenticatable.findById(payload.id)

    return authenticatable
  }
}

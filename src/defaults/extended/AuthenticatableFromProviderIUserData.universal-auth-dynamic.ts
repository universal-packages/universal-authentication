import Authentication from '../../Authentication'
import { Authenticatable, AuthDynamicNames, AuthenticatableFromProviderUserDataPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('authenticatable-from-provider-user-data', true)
export default class AuthenticatableFromProviderIUserDataDynamic {
  public perform(payload: AuthenticatableFromProviderUserDataPayload, authentication: Authentication): Authenticatable {
    const Authenticatable = authentication.Authenticatable
    const { provider, attributes } = payload
    const authenticatable = new Authenticatable()

    authentication.performDynamicSync('set-authenticatable-attributes', { authenticatable, attributes })
    authentication.performDynamicSync('set-authenticatable-provider-id', { authenticatable, provider, id: attributes.id })

    return authenticatable
  }
}

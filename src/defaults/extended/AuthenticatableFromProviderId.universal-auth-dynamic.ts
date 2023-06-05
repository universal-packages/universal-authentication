import Authentication from '../../Authentication'
import { AuthDynamicNames, Authenticatable, AuthenticatableFromProviderIdPayload } from '../../types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('authenticatable-from-provider-id', true)
export default class AuthenticatableFromProviderIdDynamic {
  public async perform(payload: AuthenticatableFromProviderIdPayload, authentication: Authentication): Promise<Authenticatable> {
    const Authenticatable = authentication.Authenticatable
    const { provider, id } = payload

    const authenticatable = await Authenticatable.findByProviderId(provider, id)

    return authenticatable
  }
}

import Authentication from '../../Authentication'
import { Authenticatable, AuthDynamicNames, AuthenticatableFromProviderUserDataPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('authenticatable-from-provider-user-data', true)
export default class AuthenticatableFromProviderIUserDataDynamic {
  public async perform(payload: AuthenticatableFromProviderUserDataPayload, authentication: Authentication): Promise<Authenticatable> {
    const Authenticatable = authentication.Authenticatable
    const { provider, userData } = payload
    const authenticatable = new Authenticatable()

    authentication.performDynamicSync('set-authenticatable-attributes', { authenticatable, attributes: userData })
    authentication.performDynamicSync('set-authenticatable-provider-id', { authenticatable, provider, id: userData.id })

    return authenticatable
  }
}

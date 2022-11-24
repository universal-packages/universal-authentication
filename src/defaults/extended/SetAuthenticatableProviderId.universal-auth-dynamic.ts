import { AuthDynamicNames, SetAuthenticatableProviderIdPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-provider-id', true)
export default class SetAuthenticatableProviderIdDynamic {
  public perform(payload: SetAuthenticatableProviderIdPayload): void {
    const { authenticatable, provider, id } = payload
    const providerKey = `${provider}Id`

    authenticatable[providerKey] = id
  }
}

import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, SetAuthenticatableProviderIdPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-provider-id', true)
export default class SetAuthenticatableProviderIdDynamic {
  public perform(payload: SetAuthenticatableProviderIdPayload): void {
    const { authenticatable, provider, id } = payload
    const providerKey = `${provider}Id`

    authenticatable[providerKey] = id
  }
}

import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, ConnectProviderPayload, ProviderUserData } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('connect-provider', true)
export default class ConnectProviderDynamic {
  public async perform(payload: ConnectProviderPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { authenticatable, provider, token } = payload

    const dynamicName = `get-${provider}-user-data`
    const providerKeys = authentication.options.providerKeys[provider]

    const providerUserData: ProviderUserData = await authentication.performDynamic(dynamicName, { token, keys: providerKeys })

    if (!providerUserData.error) {
      authentication.performDynamicSync('set-authenticatable-provider-id', { authenticatable, provider, id: providerUserData.id })
      await authentication.performDynamic('save-authenticatable', { authenticatable })

      return { status: 'success', authenticatable }
    } else {
      return { status: 'failure', message: 'provider-error' }
    }
  }
}

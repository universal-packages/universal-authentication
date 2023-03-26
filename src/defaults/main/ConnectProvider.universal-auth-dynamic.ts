import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, ConnectProviderPayload, ProviderDataResult } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('connect-provider', true)
export default class ConnectProviderDynamic {
  public async perform(payload: ConnectProviderPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { authenticatable, provider, token } = payload

    if (!authentication.performDynamicSync('is-authenticatable-connected?', { authenticatable, provider })) {
      const dynamicName = `get-${provider}-user-data`
      const providerKeys = authentication.options.providerKeys[provider]

      if (authentication.dynamics[dynamicName]) {
        const providerDataResult: ProviderDataResult = await authentication.performDynamic(dynamicName, { token, keys: providerKeys })

        if (!providerDataResult.error) {
          const { attributes } = providerDataResult
          authentication.performDynamicSync('set-authenticatable-provider-id', { authenticatable, provider, id: attributes.id })
          await authentication.performDynamic('save-authenticatable', { authenticatable })

          return { status: 'success', authenticatable }
        } else {
          return { status: 'failure', message: 'provider-error' }
        }
      } else {
        return { status: 'failure', message: 'unknown-provider' }
      }
    } else {
      return { status: 'warning', message: 'already-connected' }
    }
  }
}

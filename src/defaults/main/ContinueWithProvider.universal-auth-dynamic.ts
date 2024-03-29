import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, AuthenticationResult, ContinueWithProviderPayload, ProviderDataResult } from '../../types'

@AuthDynamic<AuthDynamicNames>('continue-with-provider', true)
export default class ContinueWithProviderDynamic {
  public async perform(payload: ContinueWithProviderPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { provider, token } = payload

    const dynamicName = `get-${provider}-user-data`
    const providerKeys = authentication.options.providerKeys[provider]

    if (authentication.dynamics[dynamicName]) {
      const providerDataResult: ProviderDataResult = await authentication.performDynamic(dynamicName, { token, keys: providerKeys })

      if (!providerDataResult.error) {
        const { attributes } = providerDataResult
        const authenticatable = await authentication.performDynamic('authenticatable-from-provider-id', { provider, id: attributes.id })

        if (authenticatable) {
          let shouldSave = false

          if (
            authentication.options.email?.enableConfirmation &&
            !authentication.performDynamicSync('is-authenticatable-confirmed?', { authenticatable, credentialKind: 'email' }) &&
            (providerDataResult.attributes.email === authenticatable.email || providerDataResult.attributes.email === authenticatable.unconfirmedEmail)
          ) {
            authentication.performDynamicSync('stablish-authenticatable-unconfirmed-credential', { authenticatable, credentialKind: 'email' })
            authentication.performDynamicSync('set-authenticatable-confirmed', { authenticatable, credentialKind: 'email' })
            shouldSave = true
          }

          if (authentication.options.enableLogInCount) {
            authentication.performDynamicSync('set-authenticatable-log-in-count', { authenticatable })
            shouldSave = true
          }

          if (shouldSave) await authentication.performDynamic('save-authenticatable', { authenticatable })

          return { status: 'success', authenticatable }
        } else {
          const authenticatable = authentication.performDynamicSync('authenticatable-from-provider-user-data', { provider, attributes })
          await authentication.performDynamic('save-authenticatable', { authenticatable })

          return { status: 'success', authenticatable }
        }
      } else {
        return { status: 'failure', message: 'provider-error' }
      }
    } else {
      return { status: 'failure', message: 'unknown-provider' }
    }
  }
}

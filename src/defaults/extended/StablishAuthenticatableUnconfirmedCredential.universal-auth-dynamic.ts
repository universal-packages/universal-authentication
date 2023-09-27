import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, SetAuthenticatableUnconfirmedCredentialPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('stablish-authenticatable-unconfirmed-credential', true)
export default class StablishAuthenticatableUnconfirmedCredentialDynamic {
  public perform(payload: SetAuthenticatableUnconfirmedCredentialPayload): void {
    const { authenticatable, credentialKind } = payload

    const unconfirmedCredentialKey = `unconfirmed${credentialKind.charAt(0).toUpperCase()}${credentialKind.slice(1)}`

    if (authenticatable[unconfirmedCredentialKey]) {
      authenticatable[credentialKind] = authenticatable[unconfirmedCredentialKey]
      authenticatable[unconfirmedCredentialKey] = null
    }
  }
}

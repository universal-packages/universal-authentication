import { AuthDynamicNames, SetAuthenticatableUnconfirmedCredentialPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-unconfirmed-credential', true)
export default class SetAuthenticatableUnconfirmedCredentialDynamic {
  public perform(payload: SetAuthenticatableUnconfirmedCredentialPayload): void {
    const { authenticatable, credential, credentialKind } = payload

    authenticatable[`unconfirmed${credentialKind.charAt(0).toUpperCase()}${credentialKind.slice(1)}`] = credential.toLowerCase()
  }
}

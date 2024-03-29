import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, SetAuthenticatableUnconfirmedCredentialPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-unconfirmed-credential', true)
export default class SetAuthenticatableUnconfirmedCredentialDynamic {
  public perform(payload: SetAuthenticatableUnconfirmedCredentialPayload, authentication: Authentication): void {
    const { authenticatable, credential, credentialKind } = payload

    if (authentication.performDynamicSync('is-authenticatable-confirmed?', { authenticatable, credentialKind })) {
      authenticatable[`unconfirmed${credentialKind.charAt(0).toUpperCase()}${credentialKind.slice(1)}`] = credential.toLowerCase()
    } else {
      authenticatable[credentialKind] = credential.toLowerCase()
    }
  }
}

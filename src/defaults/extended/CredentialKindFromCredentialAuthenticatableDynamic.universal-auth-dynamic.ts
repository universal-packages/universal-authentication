import { AuthDynamicNames, CredentialKind, CredentialKindFromCredentialAuthenticatablePayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('credential-kind-from-credential-authenticatable', true)
export default class CredentialKindFromCredentialAuthenticatableDynamic {
  public perform(payload: CredentialKindFromCredentialAuthenticatablePayload): CredentialKind {
    if (payload.authenticatable.email === payload.credential.toLowerCase()) return 'email'
    if (payload.authenticatable.username === payload.credential) return 'email'

    if (payload.authenticatable.phone === payload.credential) return 'phone'
  }
}

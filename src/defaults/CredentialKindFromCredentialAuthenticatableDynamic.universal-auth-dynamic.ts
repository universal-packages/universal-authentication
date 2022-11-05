import { AuthDynamicPayload, AuthDynamicNames, CredentialAuthenticatablePayload, CredentialKind } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('credential-kind-from-credential-authenticatable', true)
export default class CredentialKindFromCredentialAuthenticatableDynamic {
  public perform(payload: AuthDynamicPayload<CredentialAuthenticatablePayload>): CredentialKind {
    if (payload.body.authenticatable.email === payload.body.credential.toLowerCase()) return 'email'
    if (payload.body.authenticatable.username === payload.body.credential) return 'email'

    if (payload.body.authenticatable.phone === payload.body.credential) return 'phone'
  }
}

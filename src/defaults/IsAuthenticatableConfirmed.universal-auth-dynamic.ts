import { AuthDynamicNames, AuthDynamicPayload, CredentialKindAuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-confirmed?', true)
export default class IsAuthenticatableConfirmedDynamic {
  public perform(payload: AuthDynamicPayload<CredentialKindAuthenticatablePayload>): boolean {
    const { authenticatable, credentialKind } = payload.body

    return !!authenticatable[`${credentialKind}ConfirmedAt`]
  }
}

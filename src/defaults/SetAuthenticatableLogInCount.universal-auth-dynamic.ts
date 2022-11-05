import { AuthDynamicNames, AuthDynamicPayload, CredentialKindAuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-log-in-count', true)
export default class SetAuthenticatableLogInCountDynamic {
  public perform(payload: AuthDynamicPayload<CredentialKindAuthenticatablePayload>): void {
    const { authenticatable, credentialKind } = payload.body

    authenticatable[`${credentialKind}LogInCount`] = (authenticatable[`${credentialKind}LogInCount`] || 0) + 1
  }
}

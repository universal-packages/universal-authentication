import { AuthDynamicNames, AuthDynamicPayload, CredentialKindAuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-fail-attempt', true)
export default class SetAuthenticatableFailAttemptDynamic {
  public perform(payload: AuthDynamicPayload<CredentialKindAuthenticatablePayload>): void {
    const { authenticatable, credentialKind } = payload.body

    authenticatable[`${credentialKind}FailedLogInAttempts`] = (authenticatable[`${credentialKind}FailedLogInAttempts`] || 0) + 1
  }
}

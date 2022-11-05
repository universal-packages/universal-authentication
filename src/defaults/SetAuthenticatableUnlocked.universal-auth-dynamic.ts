import { AuthDynamicNames, AuthDynamicPayload, CredentialKindAuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-unlocked', true)
export default class SetAuthenticatableUnlockedDynamic {
  public perform(payload: AuthDynamicPayload<CredentialKindAuthenticatablePayload>): void {
    const { authenticatable, credentialKind } = payload.body

    authenticatable[`${credentialKind}FailedLogInAttempts`] = 0
    authenticatable[`${credentialKind}LockedAt`] = null
  }
}

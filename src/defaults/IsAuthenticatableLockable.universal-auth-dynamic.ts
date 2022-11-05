import { AuthDynamicNames, AuthDynamicPayload, CredentialKindAuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-lockable?', true)
export default class IsAuthenticatableLockableDynamic {
  public perform(payload: AuthDynamicPayload<CredentialKindAuthenticatablePayload>): boolean {
    const { authenticatable, credentialKind } = payload.body

    return payload.authOptions[credentialKind].maxAttemptsUntilLock <= authenticatable[`${credentialKind}FailedLogInAttempts`]
  }
}

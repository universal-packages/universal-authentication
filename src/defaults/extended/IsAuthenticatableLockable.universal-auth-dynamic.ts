import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, IsAuthenticatableLockablePayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-lockable?', true)
export default class IsAuthenticatableLockableDynamic {
  public perform(payload: IsAuthenticatableLockablePayload, authentication: Authentication): boolean {
    const { authenticatable } = payload

    return authentication.options.maxAttemptsUntilLock <= authenticatable.failedLogInAttempts
  }
}

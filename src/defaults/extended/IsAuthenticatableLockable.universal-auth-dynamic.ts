import Authentication from '../../Authentication'
import { AuthDynamicNames, IsAuthenticatableLockablePayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-lockable?', true)
export default class IsAuthenticatableLockableDynamic {
  public perform(payload: IsAuthenticatableLockablePayload, authentication: Authentication): boolean {
    const { authenticatable } = payload

    return authentication.options.maxAttemptsUntilLock <= authenticatable.failedLogInAttempts
  }
}

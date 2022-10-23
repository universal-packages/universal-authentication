import { Authenticatable, DynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('is-authenticatable-lockable?', true)
export default class IsAuthenticatableLockableDynamic {
  public perform(payload: DynamicPayload<{ authenticatable: Authenticatable }>): boolean {
    return payload.authOptions.maxAttemptsUntilLock <= payload.body.authenticatable.failedLogInAttempts
  }
}

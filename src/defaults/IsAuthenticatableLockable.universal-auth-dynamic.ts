import { AuthenticatableBody, AuthDynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('is-authenticatable-lockable?', true)
export default class IsAuthenticatableLockableDynamic {
  public perform(payload: AuthDynamicPayload<AuthenticatableBody>): boolean {
    return payload.authOptions.maxAttemptsUntilLock <= payload.body.authenticatable.failedLogInAttempts
  }
}

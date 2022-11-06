import { AuthDynamicNames, AuthDynamicPayload, AuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-lockable?', true)
export default class IsAuthenticatableLockableDynamic {
  public perform(payload: AuthDynamicPayload<AuthenticatablePayload>): boolean {
    const { authenticatable } = payload.body

    return payload.authOptions.maxAttemptsUntilLock <= authenticatable.failedLogInAttempts
  }
}

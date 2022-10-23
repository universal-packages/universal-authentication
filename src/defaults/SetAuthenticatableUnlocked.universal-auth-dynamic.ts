import { AuthenticatableBody, AuthDynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('set-authenticatable-unlocked', true)
export default class SetAuthenticatableUnlockedDynamic {
  public perform(payload: AuthDynamicPayload<AuthenticatableBody>): void {
    payload.body.authenticatable.unlockToken = null
    payload.body.authenticatable.failedLogInAttempts = 0
    payload.body.authenticatable.lockedAt = null
  }
}

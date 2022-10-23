import { Authenticatable, DynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('set-authenticatable-unlocked', true)
export default class SetAuthenticatableUnlockedDynamic {
  public perform(payload: DynamicPayload<{ authenticatable: Authenticatable }>): void {
    payload.body.authenticatable.unlockToken = null
    payload.body.authenticatable.failedLogInAttempts = 0
    payload.body.authenticatable.lockedAt = null
  }
}

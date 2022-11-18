import { AuthDynamicNames, SetAuthenticatableUnlockedPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-unlocked', true)
export default class SetAuthenticatableUnlockedDynamic {
  public perform(payload: SetAuthenticatableUnlockedPayload): void {
    const { authenticatable } = payload

    authenticatable.failedLogInAttempts = 0
    authenticatable.lockedAt = null
  }
}

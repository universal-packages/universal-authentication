import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, SetAuthenticatableUnlockedPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-unlocked', true)
export default class SetAuthenticatableUnlockedDynamic {
  public perform(payload: SetAuthenticatableUnlockedPayload): void {
    const { authenticatable } = payload

    authenticatable.failedLogInAttempts = 0
    authenticatable.lockedAt = null
  }
}

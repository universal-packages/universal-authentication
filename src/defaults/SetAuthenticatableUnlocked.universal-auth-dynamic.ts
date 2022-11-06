import { AuthDynamicNames, AuthDynamicPayload, AuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-unlocked', true)
export default class SetAuthenticatableUnlockedDynamic {
  public perform(payload: AuthDynamicPayload<AuthenticatablePayload>): void {
    const { authenticatable } = payload.body

    authenticatable.failedLogInAttempts = 0
    authenticatable.lockedAt = null
  }
}

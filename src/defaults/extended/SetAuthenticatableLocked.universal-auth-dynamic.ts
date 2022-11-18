import { AuthDynamicNames, SetAuthenticatableLockedPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-locked', true)
export default class SetAuthenticatableLockedDynamic {
  public perform(payload: SetAuthenticatableLockedPayload): void {
    const { authenticatable } = payload

    authenticatable.lockedAt = new Date()
  }
}

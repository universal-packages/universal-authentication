import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, SetAuthenticatableLockedPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-locked', true)
export default class SetAuthenticatableLockedDynamic {
  public perform(payload: SetAuthenticatableLockedPayload): void {
    const { authenticatable } = payload

    authenticatable.lockedAt = new Date()
  }
}

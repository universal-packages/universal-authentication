import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, IsAuthenticatableLockedPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-locked?', true)
export default class IsAuthenticatableLockedDynamic {
  public perform(payload: IsAuthenticatableLockedPayload): boolean {
    const { authenticatable } = payload

    return !!authenticatable.lockedAt
  }
}

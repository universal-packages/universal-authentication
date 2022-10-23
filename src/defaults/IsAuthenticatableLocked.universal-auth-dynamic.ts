import { Authenticatable, DynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('is-authenticatable-locked?', true)
export default class IsAuthenticatableLockedDynamic {
  public perform(payload: DynamicPayload<{ authenticatable: Authenticatable }>): boolean {
    return !!payload.body.authenticatable.lockedAt
  }
}

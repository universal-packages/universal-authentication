import { AuthenticatableBody, DynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('is-authenticatable-locked?', true)
export default class IsAuthenticatableLockedDynamic {
  public perform(payload: DynamicPayload<AuthenticatableBody>): boolean {
    return !!payload.body.authenticatable.lockedAt
  }
}

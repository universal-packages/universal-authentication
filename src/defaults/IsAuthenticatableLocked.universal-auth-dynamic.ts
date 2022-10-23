import { AuthenticatableBody, AuthDynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('is-authenticatable-locked?', true)
export default class IsAuthenticatableLockedDynamic {
  public perform(payload: AuthDynamicPayload<AuthenticatableBody>): boolean {
    return !!payload.body.authenticatable.lockedAt
  }
}

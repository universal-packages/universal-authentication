import { AuthenticatableBody, AuthDynamicPayload } from '../Authentication.types'
import { generateRandomToken } from '../crypto'
import { AuthDynamic } from '../decorators'

@AuthDynamic('set-authenticatable-locked', true)
export default class SetAuthenticatableLockedDynamic {
  public perform(payload: AuthDynamicPayload<AuthenticatableBody>): void {
    payload.body.authenticatable.unlockToken = generateRandomToken()
    payload.body.authenticatable.lockedAt = new Date()
  }
}

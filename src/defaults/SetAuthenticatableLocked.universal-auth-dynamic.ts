import { Authenticatable, DynamicPayload } from '../Authentication.types'
import { generateRandomToken } from '../crypto'
import { AuthDynamic } from '../decorators'

@AuthDynamic('set-authenticatable-locked', true)
export default class SetAuthenticatableLockedDynamic {
  public perform(payload: DynamicPayload<{ authenticatable: Authenticatable }>): void {
    payload.body.authenticatable.unlockToken = generateRandomToken()
    payload.body.authenticatable.lockedAt = new Date()
  }
}

import ms from 'ms'
import { AuthenticatableBody, DynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('is-authenticatable-ready-to-unlock?', true)
export default class IsAuthenticatableReadyToUnlockDynamic {
  public perform(payload: DynamicPayload<AuthenticatableBody>): boolean {
    const unlockAfterMs = ms(payload.authOptions.unlockAfter)
    const timeAfterLocking = payload.body.authenticatable.lockedAt.getTime() + unlockAfterMs

    return timeAfterLocking <= new Date().getTime()
  }
}

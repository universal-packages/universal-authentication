import ms from 'ms'
import { AuthDynamicNames, AuthDynamicPayload, AuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-ready-to-unlock?', true)
export default class IsAuthenticatableReadyToUnlockDynamic {
  public perform(payload: AuthDynamicPayload<AuthenticatablePayload>): boolean {
    const { authenticatable } = payload.body

    const unlockAfterMs = ms(payload.authOptions.unlockAfter)
    const timeAfterLocking = authenticatable.lockedAt.getTime() + unlockAfterMs

    return timeAfterLocking <= Date.now()
  }
}

import ms from 'ms'
import Authentication from '../../Authentication'
import { AuthDynamicNames, IsAuthenticatableReadyToUnlockPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-ready-to-unlock?', true)
export default class IsAuthenticatableReadyToUnlockDynamic {
  public perform(payload: IsAuthenticatableReadyToUnlockPayload, authentication: Authentication): boolean {
    const { authenticatable } = payload

    const unlockAfterMs = ms(authentication.options.unlockAfter)
    const timeAfterLocking = authenticatable.lockedAt.getTime() + unlockAfterMs

    return timeAfterLocking <= Date.now()
  }
}

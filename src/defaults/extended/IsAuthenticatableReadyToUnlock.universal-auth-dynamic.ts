import ms from 'ms'

import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, IsAuthenticatableReadyToUnlockPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-ready-to-unlock?', true)
export default class IsAuthenticatableReadyToUnlockDynamic {
  public perform(payload: IsAuthenticatableReadyToUnlockPayload, authentication: Authentication): boolean {
    const { authenticatable } = payload

    const unlockAfterMs = ms(authentication.options.unlockAfter)
    const timeAfterLocking = authenticatable.lockedAt.getTime() + unlockAfterMs

    return timeAfterLocking <= Date.now()
  }
}

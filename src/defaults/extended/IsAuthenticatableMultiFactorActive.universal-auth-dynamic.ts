import ms from 'ms'

import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, IsAuthenticatableMultiFactorActivePayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-multi-factor-active?', true)
export default class IsAuthenticatableMultiFactorActiveDynamic {
  public perform(payload: IsAuthenticatableMultiFactorActivePayload, authentication: Authentication): boolean {
    const { authenticatable } = payload

    if (authenticatable.multiFactorActiveAt) {
      const limitTimeMs = ms(authentication.options.multiFactorActivityLimit)
      const activeTimeLimit = authenticatable.multiFactorActiveAt.getTime() + limitTimeMs

      return activeTimeLimit > Date.now()
    }

    return false
  }
}

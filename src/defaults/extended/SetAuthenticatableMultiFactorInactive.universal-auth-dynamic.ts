import { AuthDynamicNames, SetAuthenticatableMultiFactorInactivePayload } from '../../types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-multi-factor-inactive', true)
export default class SetAuthenticatableMultiFactorInactiveDynamic {
  public perform(payload: SetAuthenticatableMultiFactorInactivePayload): void {
    const { authenticatable } = payload

    authenticatable.multiFactorActiveAt = null
  }
}

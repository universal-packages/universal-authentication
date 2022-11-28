import { AuthDynamicNames, SetAuthenticatableMultiFactorActivePayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-multi-factor-active', true)
export default class SetAuthenticatableMultiFactorActiveDynamic {
  public perform(payload: SetAuthenticatableMultiFactorActivePayload): void {
    const { authenticatable } = payload

    authenticatable.multiFactorActiveAt = new Date()
  }
}

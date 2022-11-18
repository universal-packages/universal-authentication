import { AuthDynamicNames, IsAuthenticatableMultiFactorActivePayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-multi-factor-active?', true)
export default class IsAuthenticatableMultiFactorActiveDynamic {
  public perform(payload: IsAuthenticatableMultiFactorActivePayload): boolean {
    const { authenticatable } = payload

    return !!authenticatable.multiFactorActive
  }
}

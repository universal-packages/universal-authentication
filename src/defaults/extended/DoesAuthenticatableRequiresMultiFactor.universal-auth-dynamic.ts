import { AuthDynamicNames, DoesAuthenticatableRequiresMultiFactorPayload } from '../../types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('does-authenticatable-requires-multi-factor?', true)
export default class DoesAuthenticatableRequiresMultiFactorDynamic {
  public perform(payload: DoesAuthenticatableRequiresMultiFactorPayload): boolean {
    const { authenticatable } = payload

    return !!authenticatable.multiFactorEnabled
  }
}

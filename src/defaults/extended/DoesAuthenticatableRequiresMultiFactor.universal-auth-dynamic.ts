import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, DoesAuthenticatableRequiresMultiFactorPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('does-authenticatable-requires-multi-factor?', true)
export default class DoesAuthenticatableRequiresMultiFactorDynamic {
  public perform(payload: DoesAuthenticatableRequiresMultiFactorPayload): boolean {
    const { authenticatable } = payload

    return !!authenticatable.multiFactorEnabled
  }
}

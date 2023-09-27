import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, DoesAuthenticatableRequiresMultiFactorPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('does-authenticatable-have-password?', true)
export default class DoesAuthenticatableHavePasswordDynamic {
  public perform(payload: DoesAuthenticatableRequiresMultiFactorPayload): boolean {
    const { authenticatable } = payload

    return !!authenticatable.encryptedPassword
  }
}

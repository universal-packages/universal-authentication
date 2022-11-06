import { AuthDynamicNames, AuthDynamicPayload, AuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('does-authenticatable-requires-multi-factor?', true)
export default class DoesAuthenticatableRequiresMultiFactorDynamic {
  public perform(payload: AuthDynamicPayload<AuthenticatablePayload>): boolean {
    const { authenticatable } = payload.body

    return !!authenticatable.multiFactorEnabled
  }
}

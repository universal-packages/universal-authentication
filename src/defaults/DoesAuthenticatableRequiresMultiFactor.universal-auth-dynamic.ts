import { Authenticatable, DynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('does-authenticatable-requires-multi-factor?', true)
export default class DoesAuthenticatableRequiresMultiFactorDynamic {
  public perform(payload: DynamicPayload<{ authenticatable: Authenticatable }>): boolean {
    return !!payload.body.authenticatable.multiFactorEnabled
  }
}

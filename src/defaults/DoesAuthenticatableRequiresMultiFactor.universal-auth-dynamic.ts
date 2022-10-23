import { AuthenticatableBody, DynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('does-authenticatable-requires-multi-factor?', true)
export default class DoesAuthenticatableRequiresMultiFactorDynamic {
  public perform(payload: DynamicPayload<AuthenticatableBody>): boolean {
    return !!payload.body.authenticatable.multiFactorEnabled
  }
}

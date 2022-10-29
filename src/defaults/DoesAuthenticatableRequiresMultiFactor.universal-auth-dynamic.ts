import { AuthenticatablePayload, AuthDynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('does-authenticatable-requires-multi-factor?', true)
export default class DoesAuthenticatableRequiresMultiFactorDynamic {
  public perform(payload: AuthDynamicPayload<AuthenticatablePayload>): boolean {
    return !!payload.body.authenticatable.multiFactorEnabled
  }
}

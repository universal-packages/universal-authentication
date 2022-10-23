import { AuthenticatableBody, AuthDynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('set-authenticatable-multi-factor', true)
export default class SetAuthenticatableMultiFactorDynamic {
  public perform(payload: AuthDynamicPayload<AuthenticatableBody>): void {
    payload.body.authenticatable.multiFactorToken = `${Math.floor(Math.random() * 999)}-${Math.floor(Math.random() * 999)}`
  }
}

import { AuthenticatablePayload, AuthDynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('set-authenticatable-multi-factor', true)
export default class SetAuthenticatableMultiFactorDynamic {
  public perform(payload: AuthDynamicPayload<AuthenticatablePayload>): void {
    payload.body.authenticatable.multiFactorToken = `${Math.floor(Math.random() * 999)}-${Math.floor(Math.random() * 999)}`
  }
}

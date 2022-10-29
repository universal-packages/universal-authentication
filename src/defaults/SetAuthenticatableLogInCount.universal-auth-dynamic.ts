import { AuthenticatablePayload, AuthDynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('set-authenticatable-log-in-count', true)
export default class SetAuthenticatableLogInCountDynamic {
  public perform(payload: AuthDynamicPayload<AuthenticatablePayload>): void {
    payload.body.authenticatable.logInCount = (payload.body.authenticatable.logInCount || 0) + 1
  }
}

import { AuthenticatableBody, DynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('set-authenticatable-log-in-count', true)
export default class SetAuthenticatableLogInCountDynamic {
  public perform(payload: DynamicPayload<AuthenticatableBody>): void {
    payload.body.authenticatable.logInCount = (payload.body.authenticatable.logInCount || 0) + 1
  }
}

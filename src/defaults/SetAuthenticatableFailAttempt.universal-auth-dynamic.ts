import { AuthenticatableBody, AuthDynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('set-authenticatable-fail-attempt', true)
export default class SetAuthenticatableFailAttemptDynamic {
  public perform(payload: AuthDynamicPayload<AuthenticatableBody>): void {
    payload.body.authenticatable.failedLogInAttempts = payload.body.authenticatable.failedLogInAttempts + 1
  }
}

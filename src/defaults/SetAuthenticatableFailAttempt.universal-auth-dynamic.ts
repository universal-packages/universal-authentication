import { AuthDynamicNames, AuthDynamicPayload, AuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-fail-attempt', true)
export default class SetAuthenticatableFailAttemptDynamic {
  public perform(payload: AuthDynamicPayload<AuthenticatablePayload>): void {
    const { authenticatable } = payload.body

    authenticatable.failedLogInAttempts = (authenticatable.failedLogInAttempts || 0) + 1
  }
}

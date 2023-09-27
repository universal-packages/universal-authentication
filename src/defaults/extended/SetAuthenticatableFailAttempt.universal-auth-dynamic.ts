import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, SetAuthenticatableFailAttemptPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-fail-attempt', true)
export default class SetAuthenticatableFailAttemptDynamic {
  public perform(payload: SetAuthenticatableFailAttemptPayload): void {
    const { authenticatable } = payload

    authenticatable.failedLogInAttempts = (authenticatable.failedLogInAttempts || 0) + 1
  }
}

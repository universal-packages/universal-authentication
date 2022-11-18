import { AuthDynamicNames, SetAuthenticatableLogInCountPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-log-in-count', true)
export default class SetAuthenticatableLogInCountDynamic {
  public perform(payload: SetAuthenticatableLogInCountPayload): void {
    const { authenticatable } = payload

    authenticatable.logInCount = (authenticatable.logInCount || 0) + 1
  }
}

import { AuthDynamicNames, AuthDynamicPayload, AuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-log-in-count', true)
export default class SetAuthenticatableLogInCountDynamic {
  public perform(payload: AuthDynamicPayload<AuthenticatablePayload>): void {
    const { authenticatable } = payload.body

    authenticatable.logInCount = (authenticatable.logInCount || 0) + 1
  }
}

import { AuthDynamicNames, SetAuthenticatablePasswordPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-password', true)
export default class SetAuthenticatablePasswordDynamic {
  public perform(payload: SetAuthenticatablePasswordPayload): void {
    const { authenticatable, password } = payload

    authenticatable.password = password
  }
}

import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, SetAuthenticatablePasswordPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-password', true)
export default class SetAuthenticatablePasswordDynamic {
  public perform(payload: SetAuthenticatablePasswordPayload): void {
    const { authenticatable, password } = payload

    authenticatable.password = password
  }
}

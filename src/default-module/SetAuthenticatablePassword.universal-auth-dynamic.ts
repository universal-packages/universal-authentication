import { AuthDynamic } from '../decorators'
import { AuthenticatablePasswordPayload, AuthenticatablePayload, DefaultModuleDynamicNames } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'set-authenticatable-password', true)
export default class SetAuthenticatablePasswordDynamic {
  public perform(payload: AuthenticatablePasswordPayload): void {
    payload.authenticatable.password = payload.password
  }
}

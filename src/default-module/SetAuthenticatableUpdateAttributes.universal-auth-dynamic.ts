import { AuthDynamic } from '../decorators'
import { DefaultModuleDynamicNames, UpdateEmailPasswordPayload } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'set-authenticatable-update-attributes', true)
export default class SetAuthenticatableUpdateAttributesDynamic {
  public perform(payload: UpdateEmailPasswordPayload): void {
    const { authenticatable, email, password } = payload

    if (email) authenticatable.email = email
    if (password) authenticatable.password = password
  }
}

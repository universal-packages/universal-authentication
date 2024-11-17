import { AuthDynamic } from '../decorators'
import { DefaultModuleDynamicNames, UserPayload } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'get-user-current-email', true)
export default class GetUserEncryptedPasswordDynamic {
  public perform(payload: UserPayload): string {
    return payload.user.email
  }
}

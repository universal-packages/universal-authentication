import { AuthDynamic } from '../decorators'
import { AuthenticatablePayload, DefaultModuleDynamicNames } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'get-authenticatable-encrypted-password', true)
export default class GetAuthenticatableEncryptedPasswordDynamic {
  public perform(payload: AuthenticatablePayload): string {
    return payload.authenticatable.encryptedPassword
  }
}

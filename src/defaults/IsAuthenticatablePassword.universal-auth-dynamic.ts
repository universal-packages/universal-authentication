import { AuthDynamicNames, AuthDynamicPayload, PasswordAuthenticatablePayload } from '../Authentication.types'
import { checkSubjectHash } from '../crypto'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-password?', true)
export default class IsAuthenticatablePasswordDynamic {
  public perform(payload: AuthDynamicPayload<PasswordAuthenticatablePayload>): boolean {
    return checkSubjectHash(payload.body.password, payload.body.authenticatable.encryptedPassword)
  }
}

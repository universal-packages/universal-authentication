import { AuthenticatablePasswordBody, AuthDynamicPayload } from '../Authentication.types'
import { checkSubjectHash } from '../crypto'
import { AuthDynamic } from '../decorators'

@AuthDynamic('is-authenticatable-password?', true)
export default class IsAuthenticatablePasswordDynamic {
  public perform(payload: AuthDynamicPayload<AuthenticatablePasswordBody>): boolean {
    return checkSubjectHash(payload.body.password, payload.body.authenticatable.encryptedPassword)
  }
}

import { checkSubjectHash } from '@universal-packages/crypto-utils'
import { AuthDynamicNames, IsAuthenticatablePasswordPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-password?', true)
export default class IsAuthenticatablePasswordDynamic {
  public perform(payload: IsAuthenticatablePasswordPayload): boolean {
    const { authenticatable, password } = payload

    return checkSubjectHash(password, authenticatable.encryptedPassword)
  }
}

import { checkSubjectHash } from '@universal-packages/crypto-utils'

import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, IsAuthenticatablePasswordPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-password?', true)
export default class IsAuthenticatablePasswordDynamic {
  public perform(payload: IsAuthenticatablePasswordPayload): boolean {
    const { authenticatable, password } = payload

    return checkSubjectHash(password, authenticatable.encryptedPassword)
  }
}

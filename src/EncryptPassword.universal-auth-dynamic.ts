import { hashSubject } from '@universal-packages/crypto-utils'

import { AuthDynamic } from './decorators'
import { AuthDynamicNames, PasswordPayload } from './types'

@AuthDynamic<AuthDynamicNames>('encrypt-password', true)
export default class EncryptPasswordDynamic {
  public perform(payload: PasswordPayload): string {
    const { password } = payload

    return hashSubject(password)
  }
}

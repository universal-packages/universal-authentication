import { checkSubjectHash } from '@universal-packages/crypto-utils'

import { AuthDynamic } from '../decorators'
import { DefaultModuleDynamicNames, PasswordsPayload } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'do-passwords-match?', true)
export default class DoPasswordsMatchDynamic {
  public perform(payload: PasswordsPayload): boolean {
    const { password, encryptedPassword } = payload

    return checkSubjectHash(password, encryptedPassword)
  }
}

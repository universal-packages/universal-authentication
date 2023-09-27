import { encryptSubject } from '@universal-packages/crypto-utils'

import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, EncryptCorroborationPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('encrypt-corroboration', true)
export default class EncryptCorroborationDynamic {
  public perform(payload: EncryptCorroborationPayload, authentication: Authentication): string {
    const { corroboration } = payload

    return encryptSubject(corroboration, authentication.options.secret, { concern: 'corroboration' })
  }
}

import { encryptSubject } from '@universal-packages/crypto-utils'

import Authentication from '../../Authentication'
import { AuthDynamicNames, EncryptCorroborationPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('encrypt-corroboration', true)
export default class EncryptCorroborationDynamic {
  public perform(payload: EncryptCorroborationPayload, authentication: Authentication): string {
    const { corroboration } = payload

    return encryptSubject(corroboration, authentication.options.secret, { concern: 'corroboration' })
  }
}

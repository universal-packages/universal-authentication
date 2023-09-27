import { decryptSubject } from '@universal-packages/crypto-utils'

import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, Corroboration, DecryptCorroborationTokenPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('decrypt-corroboration-token', true)
export default class DecryptCorroborationTokenDynamic {
  public perform(payload: DecryptCorroborationTokenPayload, authentication: Authentication): Corroboration {
    const { token } = payload

    if (!token) return

    return decryptSubject(payload.token, authentication.options.secret, { concern: 'corroboration' })
  }
}

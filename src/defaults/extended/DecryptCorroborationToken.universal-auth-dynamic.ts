import { decryptSubject } from '@universal-packages/crypto-utils'
import Authentication from '../../Authentication'
import { AuthDynamicNames, Corroboration, DecryptCorroborationTokenPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('decrypt-corroboration-token', true)
export default class DecryptCorroborationTokenDynamic {
  public perform(payload: DecryptCorroborationTokenPayload, authentication: Authentication): Corroboration {
    const { credential, credentialKind, token } = payload

    if (!token) return

    const secret = authentication.performDynamicSync('generate-concern-secret', { concern: 'corroboration', credential, credentialKind })

    return decryptSubject(payload.token, secret, { concern: 'corroboration' })
  }
}

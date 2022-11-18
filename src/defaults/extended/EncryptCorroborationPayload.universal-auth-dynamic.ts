import Authentication from '../../Authentication'
import { AuthDynamicNames, EncryptCorroborationPayload } from '../../Authentication.types'
import { encryptSubject } from '../../crypto'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('encrypt-corroboration', true)
export default class EncryptCorroborationPayloadDynamic {
  public perform(payload: EncryptCorroborationPayload, authentication: Authentication): string {
    const { corroboration, credential, credentialKind } = payload

    const secret = authentication.performDynamicSync('generate-concern-secret', { concern: 'corroboration', credential, credentialKind })

    return encryptSubject(corroboration, secret)
  }
}

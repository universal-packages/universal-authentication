import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, SendCorroborationPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('send-corroboration', true)
export default class SendCorroborationDynamic {
  public async perform(payload: SendCorroborationPayload, authentication: Authentication): Promise<void> {
    const { credential, credentialKind, oneTimePassword } = payload

    authentication.emit('warning', { credential, credentialKind, oneTimePassword, dynamic: this.constructor.name, message: 'not implemented' })
  }
}

import Authentication from '../../Authentication'
import { AuthDynamicNames, SendMultiFactorPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('send-multi-factor', true)
export default class SendMultiFactorDynamic {
  public async perform(payload: SendMultiFactorPayload, authentication: Authentication): Promise<void> {
    const { identifier, credential, credentialKind, oneTimePassword } = payload

    authentication.emit('warning', { identifier, credential, credentialKind, oneTimePassword, dynamic: this.constructor.name, message: 'not implemented' })
  }
}

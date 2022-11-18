import Authentication from '../../Authentication'
import { AuthDynamicNames, SendMultiFactorPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('send-multi-factor', true)
export default class SendMultiFactorDynamic {
  public async perform(payload: SendMultiFactorPayload, authentication: Authentication): Promise<void> {
    const { credential, credentialKind, oneTimePassword } = payload

    authentication.emit('warning', { credential, credentialKind, oneTimePassword, dynamic: this.constructor.name, message: 'not implemented' })
  }
}

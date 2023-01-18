import Authentication from '../../Authentication'
import { AuthDynamicNames, SendPasswordResetPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('send-password-reset', true)
export default class SendPasswordResetDynamic {
  public async perform(payload: SendPasswordResetPayload, authentication: Authentication): Promise<void> {
    const { identifier, credential, credentialKind, oneTimePassword } = payload

    authentication.emit('warning', { identifier, credential, credentialKind, oneTimePassword, dynamic: this.constructor.name, message: 'not implemented' })
  }
}

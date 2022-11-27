import Authentication from '../../Authentication'
import { AuthDynamicNames, SendPasswordResetPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('send-password-reset', true)
export default class SendPasswordResetDynamic {
  public async perform(payload: SendPasswordResetPayload, authentication: Authentication): Promise<void> {
    const { credential, credentialKind, oneTimePassword } = payload

    authentication.emit('warning', { credential, credentialKind, oneTimePassword, dynamic: this.constructor.name, message: 'not implemented' })
  }
}

import Authentication from '../../Authentication'
import { AuthDynamicNames, SendPasswordResetPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('send-password-reset', true)
export default class SendPasswordResetDynamic {
  public async perform(payload: SendPasswordResetPayload, authentication: Authentication): Promise<void> {
    const { credential, oneTimePassword } = payload

    authentication.emit('warning', { credential, oneTimePassword, dynamic: this.constructor.name, message: 'not implemented' })
  }
}

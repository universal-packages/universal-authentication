import Authentication from '../../Authentication'
import { AuthDynamicNames, SendResetPasswordPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('send-reset-password', true)
export default class SendResetPasswordDynamic {
  public async perform(payload: SendResetPasswordPayload, authentication: Authentication): Promise<void> {
    const { credential, credentialKind, oneTimePassword } = payload

    authentication.emit('warning', { credential, credentialKind, oneTimePassword, dynamic: this.constructor.name, message: 'not implemented' })
  }
}

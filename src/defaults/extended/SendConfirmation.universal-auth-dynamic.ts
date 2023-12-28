import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, SendConfirmationPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('send-confirmation', true)
export default class SendConfirmationDynamic {
  public async perform(payload: SendConfirmationPayload, authentication: Authentication): Promise<void> {
    const { credential, credentialKind, oneTimePassword } = payload

    authentication.emit('warning', { message: 'Not implemented', payload: { credential, credentialKind, oneTimePassword, dynamic: this.constructor.name } })
  }
}

import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, SendConfirmationThanksPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('send-confirmation-thanks', true)
export default class SendConfirmationThanksDynamic {
  public async perform(payload: SendConfirmationThanksPayload, authentication: Authentication): Promise<void> {
    const { authenticatable, credentialKind } = payload

    authentication.emit('warning', { message: 'Not implemented', payload: { authenticatable, credentialKind, dynamic: this.constructor.name } })
  }
}

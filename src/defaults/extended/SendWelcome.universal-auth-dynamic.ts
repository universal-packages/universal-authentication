import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, SendWelcomePayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('send-welcome', true)
export default class SendWelcomeDynamic {
  public async perform(payload: SendWelcomePayload, authentication: Authentication): Promise<void> {
    const { credentialKind } = payload

    authentication.emit('warning', { message: 'Not implemented', payload: { credentialKind, dynamic: this.constructor.name } })
  }
}

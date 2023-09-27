import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, SendUnlockPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('send-unlock', true)
export default class SendUnlockDynamic {
  public async perform(payload: SendUnlockPayload, authentication: Authentication): Promise<void> {
    const { credential, oneTimePassword } = payload

    authentication.emit('warning', { credential, oneTimePassword, dynamic: this.constructor.name, message: 'not implemented' })
  }
}

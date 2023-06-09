import Authentication from '../../Authentication'
import { AuthDynamicNames, SendUnlockPayload } from '../../types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('send-unlock', true)
export default class SendUnlockDynamic {
  public async perform(payload: SendUnlockPayload, authentication: Authentication): Promise<void> {
    const { credential, oneTimePassword } = payload

    authentication.emit('warning', { credential, oneTimePassword, dynamic: this.constructor.name, message: 'not implemented' })
  }
}

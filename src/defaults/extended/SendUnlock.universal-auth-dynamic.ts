import Authentication from '../../Authentication'
import { AuthDynamicNames, SendUnlockPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('send-unlock', true)
export default class SendResetUnlockDynamic {
  public async perform(payload: SendUnlockPayload, authentication: Authentication): Promise<void> {
    const { credential, credentialKind, oneTimePassword } = payload

    authentication.emit('warning', { credential, credentialKind, oneTimePassword, dynamic: this.constructor.name, message: 'not implemented' })
  }
}

import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, SendMultiFactorPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('send-multi-factor', true)
export default class SendMultiFactorDynamic {
  public async perform(payload: SendMultiFactorPayload, authentication: Authentication): Promise<void> {
    const { credential, oneTimePassword } = payload

    authentication.emit('warning', { message: 'Not implemented', payload: { credential, oneTimePassword, dynamic: this.constructor.name } })
  }
}

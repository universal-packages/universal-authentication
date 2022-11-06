import Authentication from '../Authentication'
import { AuthDynamicNames, AuthDynamicPayload, AuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('send-multi-factor-request', true)
export default class SendMultiFactorRequestDynamic {
  public async perform(_payload: AuthDynamicPayload<AuthenticatablePayload>, authentication: Authentication): Promise<void> {
    authentication.emit('warning', { dynamic: 'send-multi-factor-request', message: 'not implemented' })
  }
}

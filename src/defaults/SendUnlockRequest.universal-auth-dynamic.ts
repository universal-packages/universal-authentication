import Authentication from '../Authentication'
import { AuthDynamicNames, AuthDynamicPayload, AuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('send-unlock-request', true)
export default class SendUnlockRequestDynamic {
  public async perform(_payload: AuthDynamicPayload<AuthenticatablePayload>, authentication: Authentication): Promise<void> {
    authentication.emit('warning', { dynamic: 'send-unlock-request', message: 'not implemented' })
  }
}

import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { AuthenticatableOneTimePasswordPayload, DefaultModuleDynamicNames } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'send-password-reset', true)
export default class SendPasswordResetDynamic {
  public async perform(_payload: AuthenticatableOneTimePasswordPayload, authentication: Authentication): Promise<void> {
    authentication.emit('warning', { message: 'Not implemented', payload: { dynamic: this.constructor.name } })
  }
}

import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { DefaultModuleDynamicNames, UserOneTimePasswordPayload } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'send-password-reset', true)
export default class SendPasswordResetDynamic {
  public async perform(_payload: UserOneTimePasswordPayload, authentication: Authentication): Promise<void> {
    authentication.emit('warning', { message: 'Not implemented', payload: { dynamic: this.constructor.name } })
  }
}

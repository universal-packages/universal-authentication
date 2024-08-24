import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { AuthenticatablePayload, DefaultModuleDynamicNames } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'send-welcome', true)
export default class SendWelcomeDynamic {
  public async perform(_payload: AuthenticatablePayload, authentication: Authentication): Promise<void> {
    authentication.emit('warning', { message: 'Not implemented', payload: { dynamic: this.constructor.name } })
  }
}

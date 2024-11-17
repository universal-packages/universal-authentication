import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { DefaultModuleDynamicNames, EmailPayload } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'user-from-email', true)
export default class UserFromEmailDynamic {
  public async perform(payload: EmailPayload, authentication: Authentication): Promise<unknown> {
    authentication.emit('warning', { message: 'Not implemented', payload: { dynamic: this.constructor.name, with: payload } })

    return null
  }
}

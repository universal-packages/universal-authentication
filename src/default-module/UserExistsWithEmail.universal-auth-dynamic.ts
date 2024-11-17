import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { DefaultModuleDynamicNames, EmailPayload } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'user-exists-with-email?', true)
export default class UserExistsWithEmailDynamic {
  public async perform(payload: EmailPayload, authentication: Authentication): Promise<boolean> {
    authentication.emit('warning', { message: 'Not implemented', payload: { dynamic: this.constructor.name, with: payload } })

    return false
  }
}

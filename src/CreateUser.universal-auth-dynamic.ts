import Authentication from './Authentication'
import { AuthDynamic } from './decorators'
import { DefaultModuleDynamicNames, EmailPasswordAndDetailsPayload } from './types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'create-user', true)
export default class CreateUserDynamic {
  public async perform(payload: EmailPasswordAndDetailsPayload, authentication: Authentication): Promise<unknown> {
    authentication.emit('warning', { message: 'Not implemented', payload: { dynamic: this.constructor.name, with: payload } })

    return null
  }
}

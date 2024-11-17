import Authentication from './Authentication'
import { AuthDynamic } from './decorators'
import { AuthDynamicNames, UpdateUserPayload } from './types'

@AuthDynamic<AuthDynamicNames>('update-user', true)
export default class UpdateUserDynamic {
  public async perform(payload: UpdateUserPayload, authentication: Authentication): Promise<unknown> {
    authentication.emit('warning', { message: 'Not implemented', payload: { dynamic: this.constructor.name, with: payload } })

    return null
  }
}

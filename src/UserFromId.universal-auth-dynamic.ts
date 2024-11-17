import Authentication from './Authentication'
import { AuthDynamic } from './decorators'
import { AuthDynamicNames, IdPayload } from './types'

@AuthDynamic<AuthDynamicNames>('user-from-id', true)
export default class UserFromIdDynamic {
  public async perform(payload: IdPayload, authentication: Authentication): Promise<unknown> {
    authentication.emit('warning', { message: 'Not implemented', payload: { dynamic: this.constructor.name, with: payload } })

    return null
  }
}

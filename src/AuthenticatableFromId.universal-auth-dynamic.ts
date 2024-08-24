import Authentication from './Authentication'
import { AuthDynamic } from './decorators'
import { AuthDynamicNames, Authenticatable, IdPayload } from './types'

@AuthDynamic<AuthDynamicNames>('authenticatable-from-id', true)
export default class AuthenticatableFromIdDynamic {
  public async perform(payload: IdPayload, authentication: Authentication): Promise<Authenticatable> {
    const AuthenticatableClass = authentication.Authenticatable
    const authenticatable = await AuthenticatableClass.fromId(payload.id)

    return authenticatable
  }
}

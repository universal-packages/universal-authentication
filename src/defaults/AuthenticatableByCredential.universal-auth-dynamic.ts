import { Authenticatable, DynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('authenticatable-by-credential', true)
export default class AuthenticatableByCredentialDynamic {
  public async perform(payload: DynamicPayload<{ credential: string }>): Promise<Authenticatable> {
    const Authenticatable = payload.Authenticatable
    const authenticatable = await Authenticatable.findByCredential(payload.body.credential)

    return authenticatable
  }
}

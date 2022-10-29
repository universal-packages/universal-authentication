import { AuthenticatablePayload, AuthDynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('save-authenticatable', true)
export default class SaveAuthenticatableDynamic {
  public async perform(payload: AuthDynamicPayload<AuthenticatablePayload>): Promise<void> {
    await payload.body.authenticatable.save()
  }
}

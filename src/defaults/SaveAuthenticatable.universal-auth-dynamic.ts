import { AuthenticatableBody, AuthDynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('save-authenticatable', true)
export default class SaveAuthenticatableDynamic {
  public async perform(payload: AuthDynamicPayload<AuthenticatableBody>): Promise<void> {
    await payload.body.authenticatable.save()
  }
}

import { AuthenticatableBody, DynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('save-authenticatable', true)
export default class SaveAuthenticatableDynamic {
  public async perform(payload: DynamicPayload<AuthenticatableBody>): Promise<void> {
    await payload.body.authenticatable.save()
  }
}

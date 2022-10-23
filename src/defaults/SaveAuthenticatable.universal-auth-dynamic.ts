import { Authenticatable, DynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('save-authenticatable', true)
export default class SaveAuthenticatableDynamic {
  public async perform(payload: DynamicPayload<{ authenticatable: Authenticatable }>): Promise<void> {
    await payload.body.authenticatable.save()
  }
}

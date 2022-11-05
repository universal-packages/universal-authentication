import { AuthenticatablePayload, AuthDynamicPayload, AuthDynamicNames } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('save-authenticatable', true)
export default class SaveAuthenticatableDynamic {
  public async perform(payload: AuthDynamicPayload<AuthenticatablePayload>): Promise<void> {
    await payload.body.authenticatable.save()
  }
}

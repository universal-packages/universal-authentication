import { AuthDynamic } from './decorators'
import { AuthDynamicNames, AuthenticatablePayload } from './types'

@AuthDynamic<AuthDynamicNames>('save-authenticatable', true)
export default class SaveAuthenticatableDynamic {
  public async perform(payload: AuthenticatablePayload): Promise<void> {
    const { authenticatable } = payload

    await authenticatable.save()
  }
}

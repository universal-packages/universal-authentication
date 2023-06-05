import { AuthDynamicNames, SaveAuthenticatablePayload } from '../../types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('save-authenticatable', true)
export default class SaveAuthenticatableDynamic {
  public async perform(payload: SaveAuthenticatablePayload): Promise<void> {
    const { authenticatable } = payload

    await authenticatable.save()
  }
}

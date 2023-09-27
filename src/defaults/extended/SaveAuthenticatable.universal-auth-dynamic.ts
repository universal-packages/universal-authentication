import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, SaveAuthenticatablePayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('save-authenticatable', true)
export default class SaveAuthenticatableDynamic {
  public async perform(payload: SaveAuthenticatablePayload): Promise<void> {
    const { authenticatable } = payload

    await authenticatable.save()
  }
}

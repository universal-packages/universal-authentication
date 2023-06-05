import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, ConsumeInvitationPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('consume-invitation', true)
export default class ConsumeInvitationDynamic {
  public async perform(_payload: ConsumeInvitationPayload): Promise<void> {}
}

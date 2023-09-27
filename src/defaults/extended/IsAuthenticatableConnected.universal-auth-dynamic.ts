import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, IsAuthenticatableConnectedPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-connected?', true)
export default class IsAuthenticatableConnectedDynamic {
  public perform(payload: IsAuthenticatableConnectedPayload): boolean {
    const { authenticatable, provider } = payload

    return !!authenticatable[`${provider}Id`]
  }
}

import { AuthDynamicNames, IsAuthenticatableConnectedPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-connected?', true)
export default class IsAuthenticatableConfirmedDynamic {
  public perform(payload: IsAuthenticatableConnectedPayload): boolean {
    const { authenticatable, provider } = payload

    return !!authenticatable[`${provider}Id`]
  }
}

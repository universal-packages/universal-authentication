import { AuthDynamicNames, IsAuthenticatableConfirmedPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-confirmed?', true)
export default class IsAuthenticatableConfirmedDynamic {
  public perform(payload: IsAuthenticatableConfirmedPayload): boolean {
    const { authenticatable, credentialKind } = payload

    return !!authenticatable[`${credentialKind}ConfirmedAt`]
  }
}

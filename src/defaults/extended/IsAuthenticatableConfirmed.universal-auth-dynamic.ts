import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, IsAuthenticatableConfirmedPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-confirmed?', true)
export default class IsAuthenticatableConfirmedDynamic {
  public perform(payload: IsAuthenticatableConfirmedPayload): boolean {
    const { authenticatable, credentialKind } = payload

    return !!authenticatable[`${credentialKind}ConfirmedAt`]
  }
}

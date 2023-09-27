import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, SetAuthenticatableConfirmedPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-confirmed', true)
export default class SetAuthenticatableConfirmedDynamic {
  public perform(payload: SetAuthenticatableConfirmedPayload): void {
    const { authenticatable, credentialKind } = payload

    authenticatable[`${credentialKind}ConfirmedAt`] = new Date()
  }
}

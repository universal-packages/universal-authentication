import { AuthDynamicNames, SetAuthenticatableConfirmedPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-confirmed', true)
export default class SetAuthenticatableConfirmedDynamic {
  public perform(payload: SetAuthenticatableConfirmedPayload): void {
    const { authenticatable, credentialKind } = payload

    authenticatable[`${credentialKind}ConfirmedAt`] = new Date()
  }
}

import { AuthenticatableBody, AuthDynamicPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('is-authenticatable-confirmed?', true)
export default class IsAuthenticatableConfirmedDynamic {
  public perform(payload: AuthDynamicPayload<AuthenticatableBody>): boolean {
    return !!payload.body.authenticatable.confirmedAt
  }
}

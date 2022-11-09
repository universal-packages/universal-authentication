import { AuthDynamicNames, AuthDynamicPayload, AuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-multi-factor-active?', true)
export default class IsAuthenticatableMultiFactorActiveDynamic {
  public perform(payload: AuthDynamicPayload<AuthenticatablePayload>): boolean {
    const { authenticatable } = payload.body

    return !!authenticatable.lockedAt
  }
}

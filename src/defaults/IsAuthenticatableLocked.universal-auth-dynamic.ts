import { AuthDynamicNames, AuthDynamicPayload, AuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-locked?', true)
export default class IsAuthenticatableLockedDynamic {
  public perform(payload: AuthDynamicPayload<AuthenticatablePayload>): boolean {
    const { authenticatable } = payload.body

    return !!authenticatable.lockedAt
  }
}

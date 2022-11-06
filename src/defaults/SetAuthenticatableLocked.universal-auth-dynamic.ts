import { AuthDynamicNames, AuthDynamicPayload, AuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-locked', true)
export default class SetAuthenticatableLockedDynamic {
  public perform(payload: AuthDynamicPayload<AuthenticatablePayload>): void {
    const { authenticatable } = payload.body

    authenticatable.lockedAt = new Date()
  }
}

import ms from 'ms'
import { AuthDynamicNames, AuthDynamicPayload, CredentialKindAuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-ready-to-unlock?', true)
export default class IsAuthenticatableReadyToUnlockDynamic {
  public perform(payload: AuthDynamicPayload<CredentialKindAuthenticatablePayload>): boolean {
    const { authenticatable, credentialKind } = payload.body

    const unlockAfterMs = ms(payload.authOptions[credentialKind].unlockAfter)
    const timeAfterLocking = authenticatable[`${credentialKind}LockedAt`].getTime() + unlockAfterMs

    return timeAfterLocking <= new Date().getTime()
  }
}

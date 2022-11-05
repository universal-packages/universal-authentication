import { AuthDynamicNames, AuthDynamicPayload, CredentialKindAuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('is-authenticatable-locked?', true)
export default class IsAuthenticatableLockedDynamic {
  public perform(payload: AuthDynamicPayload<CredentialKindAuthenticatablePayload>): boolean {
    const { authenticatable, credentialKind } = payload.body

    return !!authenticatable[`${credentialKind}LockedAt`]
  }
}

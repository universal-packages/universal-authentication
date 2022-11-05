import { AuthDynamicNames, AuthDynamicPayload, CredentialKindAuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-locked', true)
export default class SetAuthenticatableLockedDynamic {
  public perform(payload: AuthDynamicPayload<CredentialKindAuthenticatablePayload>): void {
    const { authenticatable, credentialKind } = payload.body

    authenticatable[`${credentialKind}LockedAt`] = new Date()
  }
}

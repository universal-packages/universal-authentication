import { AuthDynamicNames, AuthDynamicPayload, CredentialKindAuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('does-authenticatable-requires-multi-factor?', true)
export default class DoesAuthenticatableRequiresMultiFactorDynamic {
  public perform(payload: AuthDynamicPayload<CredentialKindAuthenticatablePayload>): boolean {
    const { authenticatable, credentialKind } = payload.body

    return !!authenticatable[`${credentialKind}MultiFactorEnabled`]
  }
}

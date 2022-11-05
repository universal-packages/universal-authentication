import Authentication from '../Authentication'
import { AuthDynamicNames, AuthDynamicPayload, CredentialKindAuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('send-multi-factor-request', true)
export default class SendMultiFactorRequestDynamic {
  public async perform(payload: AuthDynamicPayload<CredentialKindAuthenticatablePayload>, authentication: Authentication): Promise<void> {
    authentication.emit('warning', { credentialKind: payload.body.credentialKind, dynamic: 'send-multi-factor-request', message: 'not implemented' })
  }
}

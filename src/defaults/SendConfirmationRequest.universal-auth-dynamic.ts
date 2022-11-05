import Authentication from '../Authentication'
import { AuthDynamicNames, AuthDynamicPayload, CredentialKindAuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('send-confirmation-request', true)
export default class SendConfirmationRequestDynamic {
  public async perform(payload: AuthDynamicPayload<CredentialKindAuthenticatablePayload>, authentication: Authentication): Promise<void> {
    authentication.emit('warning', { credentialKind: payload.body.credentialKind, dynamic: 'send-confirmation-request', message: 'not implemented' })
  }
}

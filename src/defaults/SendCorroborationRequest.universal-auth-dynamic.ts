import Authentication from '../Authentication'
import { AuthDynamicNames, AuthDynamicPayload, CredentialKindAuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('send-corroboration-request', true)
export default class SendCorroborationRequestDynamic {
  public async perform(payload: AuthDynamicPayload<CredentialKindAuthenticatablePayload>, authentication: Authentication): Promise<void> {
    authentication.emit('warning', { credentialKind: payload.body.credentialKind, dynamic: 'send-corroboration-request', message: 'not implemented' })
  }
}

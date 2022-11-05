import Authentication from '../Authentication'
import { AuthDynamicNames, AuthDynamicPayload, CredentialKindAuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('send-unlock-request', true)
export default class SendUnlockRequestDynamic {
  public async perform(payload: AuthDynamicPayload<CredentialKindAuthenticatablePayload>, authentication: Authentication): Promise<void> {
    authentication.emit('warning', { credentialKind: payload.body.credentialKind, dynamic: 'send-unlock-request', message: 'not implemented' })
  }
}

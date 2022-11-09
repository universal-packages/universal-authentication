import Authentication from '../Authentication'
import { AuthDynamicNames, AuthDynamicPayload, OneTimePasswordPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('send-corroboration-request', true)
export default class SendCorroborationRequestDynamic {
  public async perform(payload: AuthDynamicPayload<OneTimePasswordPayload>, authentication: Authentication): Promise<void> {
    authentication.emit('warning', { credentialKind: payload.body.credentialKind, dynamic: 'send-corroboration-request', message: 'not implemented' })
  }
}

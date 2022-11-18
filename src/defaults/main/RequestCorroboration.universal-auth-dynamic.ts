import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, RequestCorroborationPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('request-corroboration', true)
export default class RequestCorroborationDynamic {
  public async perform(payload: RequestCorroborationPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { credential, credentialKind } = payload

    const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'corroboration', credential, credentialKind })

    await authentication.performDynamic('send-corroboration', { credential, credentialKind, oneTimePassword })

    return { status: 'success', metadata: { oneTimePassword } }
  }
}

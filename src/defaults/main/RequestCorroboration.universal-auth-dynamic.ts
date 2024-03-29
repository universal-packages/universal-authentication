import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, AuthenticationResult, RequestCorroborationPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('request-corroboration', true)
export default class RequestCorroborationDynamic {
  public async perform(payload: RequestCorroborationPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { credential, credentialKind } = payload
    const credentialKindOptions = authentication.options[credentialKind]

    if (credentialKindOptions.enableCorroboration) {
      const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'corroboration', identifier: `${credential}.${credentialKind}` })

      await authentication.performDynamic('send-corroboration', { credential, credentialKind, oneTimePassword })

      return { status: 'success' }
    } else {
      return { status: 'failure', message: 'corroboration-disabled' }
    }
  }
}

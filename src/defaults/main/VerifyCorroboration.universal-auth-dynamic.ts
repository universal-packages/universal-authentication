import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, VerifyCorroborationPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('verify-corroboration', true)
export default class VerifyCorroborationDynamic {
  public perform(payload: VerifyCorroborationPayload, authentication: Authentication): AuthenticationResult {
    const { credential, credentialKind, oneTimePassword } = payload

    if (authentication.performDynamicSync('verify-one-time-password', { concern: 'corroboration', credential, credentialKind, oneTimePassword })) {
      const corroborationToken = authentication.performDynamicSync('encrypt-corroboration', { credential, credentialKind, corroboration: { credential, credentialKind } })

      return { status: 'success', metadata: { corroborationToken } }
    }

    return { status: 'failure', message: 'invalid-one-time-password' }
  }
}

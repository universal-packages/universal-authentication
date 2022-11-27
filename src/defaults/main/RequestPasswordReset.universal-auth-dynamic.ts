import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, RequestPasswordResetPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('request-password-reset', true)
export default class RequestPasswordResetDynamic {
  public async perform(payload: RequestPasswordResetPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { credential, credentialKind } = payload

    const authenticatable = await authentication.performDynamic('authenticatable-from-credential', { credential })

    if (authenticatable) {
      const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'password-reset', credential, credentialKind })

      await authentication.performDynamic('send-password-reset', { credential, credentialKind, oneTimePassword })

      return { status: 'success', metadata: { oneTimePassword } }
    }

    return { status: 'warning', message: 'nothing-to-do' }
  }
}

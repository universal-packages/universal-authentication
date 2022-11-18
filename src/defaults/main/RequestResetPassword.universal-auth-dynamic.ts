import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, RequestResetPasswordPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('request-reset-password', true)
export default class RequestResetPasswordDynamic {
  public async perform(payload: RequestResetPasswordPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { credential, credentialKind } = payload

    const authenticatable = await authentication.performDynamic('authenticatable-from-credential', { credential })

    if (authenticatable) {
      const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'reset-password', credential, credentialKind })

      await authentication.performDynamic('send-reset-password', { credential, credentialKind, oneTimePassword })

      return { status: 'success', metadata: { oneTimePassword } }
    }

    return { status: 'warning', message: 'nothing-to-do' }
  }
}

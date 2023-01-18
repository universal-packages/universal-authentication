import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, RequestPasswordResetPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('request-password-reset', true)
export default class RequestPasswordResetDynamic {
  public async perform(payload: RequestPasswordResetPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { credential, credentialKind } = payload

    const authenticatable = await authentication.performDynamic('authenticatable-from-credential', { credential })

    if (authenticatable) {
      const identifier = String(authenticatable.id)
      const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'password-reset', identifier })

      await authentication.performDynamic('send-password-reset', { identifier, credential, credentialKind, oneTimePassword })

      return { status: 'success' }
    }

    return { status: 'warning', message: 'nothing-to-do' }
  }
}

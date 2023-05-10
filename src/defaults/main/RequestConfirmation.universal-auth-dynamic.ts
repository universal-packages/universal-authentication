import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, RequestConfirmationPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('request-confirmation', true)
export default class RequestConfirmationDynamic {
  public async perform(payload: RequestConfirmationPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { credential, credentialKind } = payload
    const credentialKindOptions = authentication.options[credentialKind]

    if (credentialKindOptions.enableConfirmation) {
      const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'confirmation', identifier: `${credential}.${credentialKind}` })

      await authentication.performDynamic('send-confirmation', { credential, credentialKind, oneTimePassword })

      return { status: 'success' }
    } else {
      return { status: 'failure', message: 'confirmation-disabled' }
    }
  }
}

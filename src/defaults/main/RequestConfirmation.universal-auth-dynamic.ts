import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, RequestConfirmationPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('request-confirmation', true)
export default class RequestConfirmationDynamic {
  public async perform(payload: RequestConfirmationPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { authenticatable, credential, credentialKind } = payload

    let finalAuthenticatable = authenticatable || (await authentication.performDynamic('authenticatable-from-credential', { credential }))
    let finalCredential = credential || finalAuthenticatable[credentialKind]

    if (authenticatable && !authentication.performDynamicSync('is-authenticatable-confirmed?', { authenticatable, credentialKind })) {
      const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'confirmation', credential, credentialKind })

      await authentication.performDynamic('send-confirmation', { credential: finalCredential, credentialKind, oneTimePassword })

      return { status: 'success', metadata: { oneTimePassword } }
    }

    return { status: 'warning', message: 'nothing-to-do' }
  }
}

import { generate } from '@universal-packages/time-based-one-time-password'
import Authentication from '../Authentication'
import { AuthDynamicNames, AuthDynamicPayload, AuthenticationResult, CredentialAndKindAuthenticatablePayload } from '../Authentication.types'
import { hashSubject } from '../crypto'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('request-confirmation', true)
export default class RequestConfirmationDynamic {
  public async perform(payload: AuthDynamicPayload<CredentialAndKindAuthenticatablePayload>, authentication: Authentication): Promise<AuthenticationResult> {
    const { authenticatable, credential, credentialKind } = payload.body

    let finalAuthenticatable = authenticatable || (await authentication.performDynamic('authenticatable-from-credential', { credential }))
    let finalCredential = credential || finalAuthenticatable[credentialKind]

    if (authenticatable && !authentication.performDynamicSync('is-authenticatable-confirmed?', { authenticatable, credentialKind })) {
      const secret = hashSubject(`${payload.authOptions.secret}.confirmation.${finalCredential}.${credentialKind}`)
      const oneTimePassword = generate(secret)

      await authentication.performDynamic('send-confirmation-request', { credential: finalCredential, credentialKind, password: oneTimePassword })

      return { status: 'success', metadata: { oneTimePassword } }
    }

    return { status: 'warning', message: 'nothing-to-do' }
  }
}

import { generate } from '@universal-packages/time-based-one-time-password'
import Authentication from '../Authentication'
import { AuthDynamicNames, AuthDynamicPayload, AuthenticationResult, CredentialAndKindAuthenticatablePayload } from '../Authentication.types'
import { hashSubject } from '../crypto'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('request-multi-factor', true)
export default class RequestMultiFactorDynamic {
  public async perform(payload: AuthDynamicPayload<CredentialAndKindAuthenticatablePayload>, authentication: Authentication): Promise<AuthenticationResult> {
    const { authenticatable, credential, credentialKind } = payload.body

    let finalAuthenticatable = authenticatable || (await authentication.performDynamic('authenticatable-from-credential', { credential }))
    let finalCredential = credential || finalAuthenticatable[credentialKind]

    if (finalAuthenticatable && (await authentication.performDynamic('is-authenticatable-multi-factor-active?', { authenticatable: finalAuthenticatable }))) {
      const secret = hashSubject(`${payload.authOptions.secret}.multi-factor.${finalCredential}.${credentialKind}`)
      const oneTimePassword = generate(secret)

      await authentication.performDynamic('send-multi-factor-request', { credential: finalCredential, credentialKind, password: oneTimePassword })

      return { status: 'success', metadata: { oneTimePassword } }
    }

    return { status: 'success', message: 'nothing-to-do' }
  }
}

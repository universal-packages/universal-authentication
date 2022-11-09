import { generate } from '@universal-packages/time-based-one-time-password'
import Authentication from '../Authentication'
import { AuthDynamicNames, AuthDynamicPayload, AuthenticationResult, CredentialAndKindPayload } from '../Authentication.types'
import { hashSubject } from '../crypto'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('request-corroboration', true)
export default class RequestCorroborationDynamic {
  public async perform(payload: AuthDynamicPayload<CredentialAndKindPayload>, authentication: Authentication): Promise<AuthenticationResult> {
    const { credential, credentialKind } = payload.body

    const secret = hashSubject(`${payload.authOptions.secret}.corroboration.${credential}.${credentialKind}`)
    const oneTimePassword = generate(secret)

    await authentication.performDynamic('send-corroboration-request', { credential, credentialKind, password: oneTimePassword })

    return { status: 'success', metadata: { oneTimePassword } }
  }
}

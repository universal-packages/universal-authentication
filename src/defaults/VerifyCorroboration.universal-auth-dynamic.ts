import { verify } from '@universal-packages/time-based-one-time-password'
import Authentication from '../Authentication'
import { AuthDynamicNames, AuthDynamicPayload, AuthenticationResult, OneTimePasswordPayload } from '../Authentication.types'
import { hashSubject } from '../crypto'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('verify-corroboration', true)
export default class VerifyCorroborationDynamic {
  public perform(payload: AuthDynamicPayload<OneTimePasswordPayload>, authentication: Authentication): AuthenticationResult {
    const { credential, credentialKind, password } = payload.body

    const secret = hashSubject(`${payload.authOptions.secret}.corroboration.${credential}.${credentialKind}`)

    if (verify(password, secret)) {
      const corroborationToken = authentication.performDynamicSync('encrypt-corroboration-payload', { credential, credentialKind })

      return { status: 'success', metadata: { corroborationToken } }
    }

    return { status: 'failure', message: 'invalid-password' }
  }
}

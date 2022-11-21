import { verify } from '@universal-packages/time-based-one-time-password'
import Authentication from '../../Authentication'
import { AuthDynamicNames, VerifyOneTimePasswordPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('verify-one-time-password', true)
export default class VerifyOneTimePasswordDynamic {
  public perform(payload: VerifyOneTimePasswordPayload, authentication: Authentication): boolean {
    const { concern, credential, credentialKind, oneTimePassword } = payload

    const secret = authentication.performDynamicSync('generate-concern-secret', { concern, credential, credentialKind })

    return verify(oneTimePassword, secret)
  }
}

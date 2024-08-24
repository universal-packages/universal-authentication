import { verify } from '@universal-packages/time-based-one-time-password'

import Authentication from './Authentication'
import { AuthDynamic } from './decorators'
import { AuthDynamicNames, VerifyOneTimePasswordPayload } from './types'

@AuthDynamic<AuthDynamicNames>('verify-one-time-password', true)
export default class VerifyOneTimePasswordDynamic {
  public perform(payload: VerifyOneTimePasswordPayload, authentication: Authentication): boolean {
    const { concern, identifier, oneTimePassword } = payload

    const secret = authentication.performDynamicSync('generate-concern-secret', { concern, identifier })

    return verify(oneTimePassword, secret, authentication.options.oneTimePassword)
  }
}

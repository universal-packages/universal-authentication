import { generate } from '@universal-packages/time-based-one-time-password'

import Authentication from './Authentication'
import { AuthDynamic } from './decorators'
import { AuthDynamicNames, GenerateOneTimePasswordPayload } from './types'

@AuthDynamic<AuthDynamicNames>('generate-one-time-password', true)
export default class GenerateOneTimePasswordDynamic {
  public perform(payload: GenerateOneTimePasswordPayload, authentication: Authentication): string {
    const { concern, identifier } = payload

    const secret = authentication.performDynamicSync('generate-concern-secret', { concern, identifier })

    return generate(secret, authentication.options.oneTimePassword)
  }
}

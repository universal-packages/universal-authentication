import { generate } from '@universal-packages/time-based-one-time-password'
import Authentication from '../../Authentication'
import { AuthDynamicNames, GenerateOneTimePasswordPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('generate-one-time-password', true)
export default class GenerateOneTimePasswordDynamic {
  public perform(payload: GenerateOneTimePasswordPayload, authentication: Authentication): string {
    const { concern, credential, credentialKind } = payload

    const secret = authentication.performDynamicSync('generate-concern-secret', { concern, credential, credentialKind })

    return generate(secret)
  }
}

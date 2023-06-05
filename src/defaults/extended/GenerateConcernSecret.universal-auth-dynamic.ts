import { digestSubject } from '@universal-packages/crypto-utils'

import Authentication from '../../Authentication'
import { AuthDynamicNames, GenerateConcernSecretPayload } from '../../types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('generate-concern-secret', true)
export default class GenerateAuthConcernSecretDynamic {
  public perform(payload: GenerateConcernSecretPayload, authentication: Authentication): string {
    const { concern, identifier } = payload

    return digestSubject(`${concern}.${identifier}`, authentication.options.secret)
  }
}

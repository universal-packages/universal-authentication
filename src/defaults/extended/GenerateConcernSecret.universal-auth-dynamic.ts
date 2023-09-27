import { digestSubject } from '@universal-packages/crypto-utils'

import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, GenerateConcernSecretPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('generate-concern-secret', true)
export default class GenerateAuthConcernSecretDynamic {
  public perform(payload: GenerateConcernSecretPayload, authentication: Authentication): string {
    const { concern, identifier } = payload

    return digestSubject(`${concern}.${identifier}`, authentication.options.secret)
  }
}

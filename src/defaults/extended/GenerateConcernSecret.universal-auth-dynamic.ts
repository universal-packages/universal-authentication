import Authentication from '../../Authentication'
import { AuthDynamicNames, GenerateConcernSecretPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('generate-concern-secret', true)
export default class GenerateAuthConcernSecretDynamic {
  public perform(payload: GenerateConcernSecretPayload, authentication: Authentication): string {
    const { concern, credential, credentialKind } = payload

    return `${authentication.options.secret}.${concern}.${credentialKind}.${credential}`
  }
}

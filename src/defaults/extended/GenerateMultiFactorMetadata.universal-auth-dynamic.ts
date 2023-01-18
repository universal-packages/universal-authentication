import { AuthDynamicNames, GenerateMultiFactorMetadataPayload, MultiFactorMetadata } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('generate-multi-factor-metadata', true)
export default class GenerateMultiFactorMetadataDynamic {
  public perform(payload: GenerateMultiFactorMetadataPayload): MultiFactorMetadata {
    const { authenticatable } = payload
    const metadata: MultiFactorMetadata = { identifier: String(authenticatable.id) }

    if (authenticatable.email) {
      metadata.email = authenticatable.email
    }

    if (authenticatable.phone) {
      metadata.phone = authenticatable.phone
    }

    return metadata
  }
}

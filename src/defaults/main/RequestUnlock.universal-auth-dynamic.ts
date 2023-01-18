import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, RequestUnlockPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('request-unlock', true)
export default class RequestUnlockDynamic {
  public async perform(payload: RequestUnlockPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { authenticatable, credentialKind } = payload

    const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'unlock', identifier: String(authenticatable.id) })

    await authentication.performDynamic('send-unlock', { credential: authenticatable[credentialKind], credentialKind, oneTimePassword })

    return { status: 'success' }
  }
}

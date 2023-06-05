import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, RequestUnlockPayload } from '../../types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('request-unlock', true)
export default class RequestUnlockDynamic {
  public async perform(payload: RequestUnlockPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { credential } = payload

    const authenticatable = await authentication.performDynamic('authenticatable-from-credential', { credential })

    if (authenticatable) {
      if (authentication.performDynamicSync('is-authenticatable-locked?', { authenticatable })) {
        const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'unlock', identifier: credential })

        await authentication.performDynamic('send-unlock', { credential, oneTimePassword })

        return { status: 'success' }
      }
    }

    return { status: 'warning', message: 'nothing-to-do' }
  }
}

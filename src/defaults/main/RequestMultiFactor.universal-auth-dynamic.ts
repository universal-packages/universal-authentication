import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, AuthenticationResult, RequestMultiFactorPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('request-multi-factor', true)
export default class RequestMultiFactorDynamic {
  public async perform(payload: RequestMultiFactorPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { credential } = payload

    const authenticatable = await authentication.performDynamic('authenticatable-from-credential', { credential })

    if (authenticatable) {
      if (authentication.performDynamicSync('is-authenticatable-multi-factor-active?', { authenticatable })) {
        const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'multi-factor', identifier: credential })

        await authentication.performDynamic('send-multi-factor', { credential, oneTimePassword })

        return { status: 'success' }
      }
    }

    return { status: 'warning', message: 'nothing-to-do' }
  }
}

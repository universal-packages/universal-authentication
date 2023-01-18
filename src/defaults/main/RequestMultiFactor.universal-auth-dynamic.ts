import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, RequestMultiFactorPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('request-multi-factor', true)
export default class RequestMultiFactorDynamic {
  public async perform(payload: RequestMultiFactorPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { identifier, credentialKind } = payload

    const authenticatable = await authentication.performDynamic('authenticatable-from-id', { id: identifier })

    if (authenticatable) {
      if (authentication.performDynamicSync('is-authenticatable-multi-factor-active?', { authenticatable })) {
        const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'multi-factor', identifier })
        const credential = authenticatable[credentialKind]

        await authentication.performDynamic('send-multi-factor', { identifier, credential, credentialKind, oneTimePassword })

        return { status: 'success' }
      }

      return { status: 'warning', message: 'nothing-to-do' }
    } else {
      return { status: 'failure', message: 'nothing-to-do' }
    }
  }
}

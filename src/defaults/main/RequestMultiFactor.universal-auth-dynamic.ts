import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, RequestMultiFactorPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('request-multi-factor', true)
export default class RequestMultiFactorDynamic {
  public async perform(payload: RequestMultiFactorPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { authenticatable, credential, credentialKind } = payload

    let finalAuthenticatable = authenticatable || (await authentication.performDynamic('authenticatable-from-credential', { credential }))
    let finalCredential = credential || finalAuthenticatable[credentialKind]

    if (finalAuthenticatable && authentication.performDynamicSync('is-authenticatable-multi-factor-active?', { authenticatable: finalAuthenticatable })) {
      const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'multi-factor', credential, credentialKind })

      await authentication.performDynamic('send-multi-factor', { credential: finalCredential, credentialKind, oneTimePassword })

      return { status: 'success', metadata: { oneTimePassword } }
    }

    return { status: 'success', message: 'nothing-to-do' }
  }
}

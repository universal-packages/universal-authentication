import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, VerifyMultiFactorPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('verify-multi-factor', true)
export default class VerifyMultiFactorDynamic {
  public async perform(payload: VerifyMultiFactorPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { identifier, oneTimePassword } = payload

    if (authentication.performDynamicSync('verify-one-time-password', { concern: 'multi-factor', identifier, oneTimePassword })) {
      const authenticatable = await authentication.performDynamic('authenticatable-from-id', { id: identifier })

      if (authentication.performDynamicSync('is-authenticatable-multi-factor-active?', { authenticatable })) {
        if (authentication.options.enableLogInCount) {
          authentication.performDynamicSync('set-authenticatable-log-in-count', { authenticatable })
        }

        authentication.performDynamicSync('set-authenticatable-multi-factor-inactive', { authenticatable })
        await authentication.performDynamic('save-authenticatable', { authenticatable })

        return { status: 'success', authenticatable }
      } else {
        return { status: 'failure', message: 'multi-factor-inactive' }
      }
    }

    return { status: 'failure', message: 'invalid-one-time-password' }
  }
}

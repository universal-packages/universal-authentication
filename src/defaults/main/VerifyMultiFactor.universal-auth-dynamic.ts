import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, VerifyMultiFactorPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('verify-multi-factor', true)
export default class VerifyMultiFactorDynamic {
  public async perform(payload: VerifyMultiFactorPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { credential, credentialKind, oneTimePassword } = payload
    const credentialKindOptions = authentication.options[credentialKind]

    if (authentication.performDynamicSync('verify-one-time-password', { concern: 'multi-factor', credential, credentialKind, oneTimePassword })) {
      const authenticatable = await authentication.performDynamic('authenticatable-from-credential', { credential })

      if (authentication.performDynamicSync('is-authenticatable-multi-factor-active?', { authenticatable })) {
        if (credentialKindOptions.enableConfirmation) {
          if (!authentication.performDynamicSync('is-authenticatable-confirmed?', { authenticatable, credentialKind })) {
            if (credentialKindOptions.enforceConfirmation) {
              return { status: 'warning', message: 'confirmation-required', metadata: { credential: authenticatable[credentialKind], credentialKind } }
            }

            if (credentialKindOptions.confirmationGracePeriod) {
              if (authentication.performDynamicSync('has-authenticatable-confirmation-passed-grace-period?', { authenticatable, credentialKind })) {
                return { status: 'warning', message: 'confirmation-required', metadata: { credential: authenticatable[credentialKind], credentialKind } }
              }
            }
          }
        }

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

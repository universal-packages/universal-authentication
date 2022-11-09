import { verify } from '@universal-packages/time-based-one-time-password'
import Authentication from '../Authentication'
import { AuthDynamicNames, AuthDynamicPayload, AuthenticationResult, OneTimePasswordPayload } from '../Authentication.types'
import { hashSubject } from '../crypto'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('verify-multi-factor', true)
export default class VerifyMultiFactorDynamic {
  public async perform(payload: AuthDynamicPayload<OneTimePasswordPayload>, authentication: Authentication): Promise<AuthenticationResult> {
    const { credential, credentialKind, password } = payload.body
    const { authOptions } = payload
    const credentialKindOptions = authOptions[credentialKind]

    const secret = hashSubject(`${payload.authOptions.secret}.multi-factor.${credential}.${credentialKind}`)

    if (verify(password, secret)) {
      const authenticatable = await authentication.performDynamic('authenticatable-from-credential', { credential })

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

      if (authOptions.enableLogInCount) {
        authentication.performDynamicSync('set-authenticatable-log-in-count', { authenticatable })
      }

      authentication.performDynamicSync('set-authenticatable-multi-factor-inactive', { authenticatable })
      await authentication.performDynamic('save-authenticatable', { authenticatable })

      return { status: 'success', authenticatable }
    }

    return { status: 'failure', message: 'invalid-password' }
  }
}

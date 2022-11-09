import Authentication from '../Authentication'
import { AuthenticationResult, AuthDynamicPayload, AuthDynamicNames, LogInPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('log-in', true)
export default class LogInDynamic {
  public async perform(payload: AuthDynamicPayload<LogInPayload>, authentication: Authentication): Promise<AuthenticationResult> {
    const { credential, password } = payload.body
    const { authOptions } = payload
    const authenticatable = await authentication.performDynamic('authenticatable-from-credential', { credential })

    if (authenticatable) {
      const credentialKind = authentication.performDynamicSync('credential-kind-from-credential-authenticatable', { credential, authenticatable })
      const credentialKindOptions = authOptions[credentialKind]

      if (authOptions.enableLocking && authOptions.unlockAfter) {
        if (authentication.performDynamicSync('is-authenticatable-locked?', { authenticatable })) {
          if (authentication.performDynamicSync('is-authenticatable-ready-to-unlock?', { authenticatable })) {
            authentication.performDynamicSync('set-authenticatable-unlocked', { authenticatable })
            await authentication.performDynamic('save-authenticatable', { authenticatable })
          }
        }
      }

      if (!authentication.performDynamicSync('is-authenticatable-locked?', { authenticatable })) {
        const passwordCheck = credentialKindOptions.enablePasswordCheck ? authentication.performDynamicSync('is-authenticatable-password?', { authenticatable, password }) : true

        if (passwordCheck) {
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

          if (authOptions.enableMultiFactor) {
            if (authOptions.enforceMultiFactor || authentication.performDynamicSync('does-authenticatable-requires-multi-factor?', { authenticatable })) {
              if (authOptions.sendMultiFactorInPlace) {
                authentication.performDynamicSync('set-authenticatable-multi-factor-active', { authenticatable })
                await authentication.performDynamic('save-authenticatable', { authenticatable })

                await authentication.performDynamic('request-multi-factor', { authenticatable, credentialKind })

                return { authenticatable, status: 'warning', message: 'multi-factor-inbound' }
              } else {
                const metadata = authentication.performDynamicSync('generate-multi-factor-metadata', { authenticatable })

                return { authenticatable, status: 'warning', message: 'multi-factor-waiting', metadata }
              }
            }
          }

          if (authOptions.enableLogInCount) {
            authentication.performDynamicSync('set-authenticatable-log-in-count', { authenticatable })
            await authentication.performDynamic('save-authenticatable', { authenticatable })
          }

          return { authenticatable, status: 'success' }
        } else {
          if (authOptions.enableLocking && authOptions.maxAttemptsUntilLock) {
            authentication.performDynamicSync('set-authenticatable-fail-attempt', { authenticatable })

            if (authentication.performDynamicSync('is-authenticatable-lockable?', { authenticatable })) {
              authentication.performDynamicSync('set-authenticatable-locked', { authenticatable })
              await authentication.performDynamic('save-authenticatable', { authenticatable })

              await authentication.performDynamic('send-unlock-request', { authenticatable })
            } else {
              await authentication.performDynamic('save-authenticatable', { authenticatable })
            }
          }
        }
      }
    }

    return { status: 'failure', message: 'invalid-credentials' }
  }
}

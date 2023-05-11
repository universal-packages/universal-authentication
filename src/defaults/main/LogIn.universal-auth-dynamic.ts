import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, LogInPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('log-in', true)
export default class LogInDynamic {
  public async perform(payload: LogInPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { credential, password } = payload
    const authenticatable = await authentication.performDynamic('authenticatable-from-credential', { credential })

    if (authenticatable) {
      const credentialKind = authentication.performDynamicSync('credential-kind-from-credential-authenticatable', { credential, authenticatable })
      const credentialKindOptions = authentication.options[credentialKind]

      if (authentication.options.enableLocking && authentication.options.unlockAfter) {
        if (authentication.performDynamicSync('is-authenticatable-locked?', { authenticatable })) {
          if (authentication.performDynamicSync('is-authenticatable-ready-to-unlock?', { authenticatable })) {
            authentication.performDynamicSync('set-authenticatable-unlocked', { authenticatable })
            await authentication.performDynamic('save-authenticatable', { authenticatable })
          }
        }
      }

      if (!authentication.performDynamicSync('is-authenticatable-locked?', { authenticatable })) {
        let passwordCheck = true

        if (credentialKindOptions.enablePasswordCheck) {
          if (authentication.performDynamicSync('does-authenticatable-have-password?', { authenticatable })) {
            passwordCheck = !!password && authentication.performDynamicSync('is-authenticatable-password?', { authenticatable, password })
          } else if (credentialKindOptions.enforcePasswordCheck) {
            passwordCheck = false
          }
        }

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

          if (credentialKindOptions.enableMultiFactor) {
            if (credentialKindOptions.enforceMultiFactor || authentication.performDynamicSync('does-authenticatable-requires-multi-factor?', { authenticatable })) {
              if (credentialKindOptions.sendMultiFactorInPlace) {
                authentication.performDynamicSync('set-authenticatable-multi-factor-active', { authenticatable })
                await authentication.performDynamic('save-authenticatable', { authenticatable })

                const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'multi-factor', identifier: authenticatable[credentialKind] })
                await authentication.performDynamic('send-multi-factor', { credential, oneTimePassword })

                return { status: 'warning', message: 'multi-factor-inbound' }
              } else {
                const metadata = authentication.performDynamicSync('generate-multi-factor-metadata', { authenticatable })

                return { status: 'warning', message: 'multi-factor-waiting', metadata }
              }
            }
          }

          if (authentication.options.enableLogInCount) {
            authentication.performDynamicSync('set-authenticatable-log-in-count', { authenticatable })
            await authentication.performDynamic('save-authenticatable', { authenticatable })
          }

          return { authenticatable, status: 'success' }
        } else {
          if (authentication.options.enableLocking && authentication.options.maxAttemptsUntilLock) {
            authentication.performDynamicSync('set-authenticatable-fail-attempt', { authenticatable })

            if (authentication.performDynamicSync('is-authenticatable-lockable?', { authenticatable })) {
              authentication.performDynamicSync('set-authenticatable-locked', { authenticatable })
              await authentication.performDynamic('save-authenticatable', { authenticatable })

              const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'unlock', identifier: authenticatable[credentialKind] })
              await authentication.performDynamic('send-unlock', { credential, oneTimePassword })

              return { status: 'failure', message: 'locked' }
            } else {
              await authentication.performDynamic('save-authenticatable', { authenticatable })
            }
          }
        }
      } else {
        return { status: 'failure', message: 'locked' }
      }
    }

    return { status: 'failure', message: 'invalid-credentials' }
  }
}

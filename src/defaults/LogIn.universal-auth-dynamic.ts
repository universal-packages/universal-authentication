import Authentication from '../Authentication'
import { Authenticatable, AuthenticationResult, AuthDynamicPayload, AuthDynamicNames, LogInPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('log-in', true)
export default class LogInDynamic {
  public async perform(payload: AuthDynamicPayload<LogInPayload>, authentication: Authentication): Promise<AuthenticationResult> {
    const { credential, password } = payload.body
    const authenticatable: Authenticatable = await authentication.performDynamic('authenticatable-from-credential', { credential })

    if (authenticatable) {
      const credentialKind = authentication.performDynamicSync('credential-kind-from-credential-authenticatable', { credential, authenticatable })
      const credentialKindOptions = payload.authOptions[credentialKind]

      if (credentialKindOptions.enableLocking && credentialKindOptions.unlockAfter) {
        if (authentication.performDynamicSync('is-authenticatable-locked?', { authenticatable, credentialKind })) {
          if (authentication.performDynamicSync('is-authenticatable-ready-to-unlock?', { authenticatable, credentialKind })) {
            authentication.performDynamicSync('set-authenticatable-unlocked', { authenticatable, credentialKind })
            await authentication.performDynamic('save-authenticatable', { authenticatable })
          }
        }
      }

      if (!authentication.performDynamicSync('is-authenticatable-locked?', { authenticatable, credentialKind })) {
        const passwordCheck = credentialKindOptions.enablePasswordCheck ? authentication.performDynamicSync('is-authenticatable-password?', { authenticatable, password }) : true

        if (passwordCheck) {
          if (credentialKindOptions.enableConfirmation) {
            if (!authentication.performDynamicSync('is-authenticatable-confirmed?', { authenticatable, credentialKind })) {
              if (credentialKindOptions.enforceConfirmation) {
                return { status: 'warning', message: 'confirmation-required' }
              }

              if (credentialKindOptions.confirmationGracePeriod) {
                if (authentication.performDynamicSync('has-authenticatable-confirmation-passed-grace-period?', { authenticatable, credentialKind })) {
                  return { status: 'warning', message: 'confirmation-required' }
                }
              }
            }
          }

          if (credentialKindOptions.enableMultiFactor) {
            if (credentialKindOptions.enforceMultiFactor || authentication.performDynamicSync('does-authenticatable-requires-multi-factor?', { authenticatable, credentialKind })) {
              if (credentialKindOptions.sendMultiFactorInPlace) {
                await authentication.performDynamic('send-multi-factor-request', { authenticatable, credentialKind })

                return { authenticatable, status: 'warning', message: 'multi-factor-inbound' }
              }

              return { authenticatable, status: 'warning', message: 'multi-factor-waiting' }
            }
          }

          if (credentialKindOptions.enableLogInCount) {
            authentication.performDynamicSync('set-authenticatable-log-in-count', { authenticatable, credentialKind })
            await authentication.performDynamic('save-authenticatable', { authenticatable })
          }

          return { authenticatable, status: 'success' }
        } else {
          if (credentialKindOptions.enableLocking && credentialKindOptions.maxAttemptsUntilLock) {
            authentication.performDynamicSync('set-authenticatable-fail-attempt', { authenticatable, credentialKind })

            if (authentication.performDynamicSync('is-authenticatable-lockable?', { authenticatable, credentialKind })) {
              authentication.performDynamicSync('set-authenticatable-locked', { authenticatable, credentialKind })
              await authentication.performDynamic('save-authenticatable', { authenticatable })

              await authentication.performDynamic('send-unlock-request', { authenticatable, credentialKind })
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

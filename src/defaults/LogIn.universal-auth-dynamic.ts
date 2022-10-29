import Authentication from '../Authentication'
import { Authenticatable, AuthenticationResult, AuthDynamicPayload, LogInPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('log-in', true)
export default class LogInDynamic {
  public async perform(payload: AuthDynamicPayload<LogInPayload>, authentication: Authentication): Promise<AuthenticationResult> {
    const authenticatable: Authenticatable = await authentication.performDynamic('authenticatable-from-credential', { credential: payload.body.credential })

    if (authenticatable) {
      if (payload.authOptions.unlockAfter) {
        if (authentication.performDynamicSync('is-authenticatable-locked?', { authenticatable })) {
          if (authentication.performDynamicSync('is-authenticatable-ready-to-unlock?', { authenticatable })) {
            authentication.performDynamicSync('set-authenticatable-unlocked', { authenticatable })
            await authentication.performDynamic('save-authenticatable', { authenticatable })
          }
        }
      }

      if (!authentication.performDynamicSync('is-authenticatable-locked?', { authenticatable })) {
        if (authentication.performDynamicSync('is-authenticatable-password?', { authenticatable, password: payload.body.password })) {
          if (payload.authOptions.enableMultiFactor) {
            if (authentication.performDynamicSync('does-authenticatable-requires-multi-factor?', { authenticatable }) || payload.authOptions.enforceMultiFactor) {
              authentication.performDynamicSync('set-authenticatable-multi-factor', { authenticatable })
              await authentication.performDynamic('save-authenticatable', { authenticatable })

              return { authenticatable, status: 'warning', message: 'multi-factor-inbound' }
            }
          }
          if (payload.authOptions.enableConfirmation && payload.authOptions.enforceConfirmation) {
            if (!authentication.performDynamicSync('is-authenticatable-confirmed?', { authenticatable })) {
              return { status: 'warning', message: 'confirmation-required' }
            }
          }

          if (payload.authOptions.enableLogInCount) {
            authentication.performDynamicSync('set-authenticatable-log-in-count', { authenticatable })
            await authentication.performDynamic('save-authenticatable', { authenticatable })
          }

          return { authenticatable, status: 'success' }
        } else {
          if (payload.authOptions.lockAfterMaxFailedAttempts) {
            authentication.performDynamicSync('set-authenticatable-fail-attempt', { authenticatable })

            if (authentication.performDynamicSync('is-authenticatable-lockable?', { authenticatable })) {
              authentication.performDynamicSync('set-authenticatable-locked', { authenticatable })
            }

            await authentication.performDynamic('save-authenticatable', { authenticatable })
          }
        }
      }
    }

    return { status: 'failure', message: 'invalid-credentials' }
  }
}

import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { AuthenticationResult, DefaultModuleDynamicNames, EmailPasswordOneTimePasswordPayload } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'verify-password-reset', true)
export default class VerifyPasswordResetDynamic {
  public async perform(payload: EmailPasswordOneTimePasswordPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { email, oneTimePassword, password } = payload

    if (authentication.performDynamicSync('verify-one-time-password', { concern: 'password-reset', identifier: email, oneTimePassword })) {
      const authenticatable = await authentication.performDynamic('authenticatable-from-email', { email })

      if (authenticatable) {
        const validation = await authentication.performDynamic('validate-password-reset', { password })

        if (validation.valid) {
          authentication.performDynamicSync('set-authenticatable-password', { authenticatable, password })
          await authentication.performDynamic('save-authenticatable', { authenticatable })

          await authentication.performDynamic('send-password-was-reset', { authenticatable })

          return { status: 'success', authenticatable }
        } else {
          return { status: 'failure', validation }
        }
      } else {
        return { status: 'failure', message: 'nothing-to-do' }
      }
    }

    return { status: 'failure', message: 'invalid-one-time-password' }
  }
}

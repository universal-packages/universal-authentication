import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { AuthenticationResult, DefaultModuleDynamicNames, EmailPasswordOneTimePasswordPayload } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'verify-password-reset', true)
export default class VerifyPasswordResetDynamic {
  public async perform(payload: EmailPasswordOneTimePasswordPayload, authentication: Authentication<DefaultModuleDynamicNames>): Promise<AuthenticationResult> {
    const { email, oneTimePassword, password } = payload

    const validation = await authentication.performDynamic('validate-password-reset', { password, oneTimePassword })

    if (validation.valid) {
      if (authentication.performDynamicSync('verify-one-time-password', { concern: 'password-reset', identifier: email, oneTimePassword })) {
        const user = await authentication.performDynamic('user-from-email', { email })

        if (user) {
          const encryptedPassword = await authentication.performDynamic('encrypt-password', { password })

          await authentication.performDynamic('update-user', { user, attributes: { encryptedPassword } })

          await authentication.performDynamic('send-password-was-reset', { user })

          return { status: 'success', user }
        } else {
          return { status: 'failure', message: 'nothing-to-do' }
        }
      }

      return { status: 'failure', message: 'invalid-one-time-password' }
    } else {
      return { status: 'failure', validation }
    }
  }
}

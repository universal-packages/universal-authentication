import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { AuthenticationResult, DefaultModuleDynamicNames, EmailPasswordPayload } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'log-in', true)
export default class LogInDynamic {
  public async perform(payload: EmailPasswordPayload, authentication: Authentication<DefaultModuleDynamicNames>): Promise<AuthenticationResult> {
    let shouldContinue = await authentication.performDynamic('continue-before-log-in?', payload)
    if (!shouldContinue) return { status: 'failure', message: 'log-in-not-allowed' }

    const { email, password } = payload
    const user = await authentication.performDynamic('user-from-email', { email })

    if (user) {
      shouldContinue = await authentication.performDynamic('continue-after-user-found?', { user })
      if (!shouldContinue) return { status: 'failure', message: 'log-in-not-allowed' }

      const encryptedPassword = await authentication.performDynamicSync('get-user-encrypted-password', { user })
      const passwordCheck = authentication.performDynamicSync('do-passwords-match?', { encryptedPassword, password })

      if (passwordCheck) {
        await authentication.performDynamic('after-log-in-success', { user })

        return { user, status: 'success' }
      } else {
        await authentication.performDynamic('after-log-in-failure', { user })
      }
    } else {
      await authentication.performDynamic('after-log-in-user-not-found', { email })
    }

    return { status: 'failure', message: 'invalid-credentials' }
  }
}

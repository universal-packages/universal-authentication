import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { AuthenticationResult, DefaultModuleDynamicNames, EmailPasswordPayload } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'log-in', true)
export default class LogInDynamic {
  public async perform(payload: EmailPasswordPayload, authentication: Authentication): Promise<AuthenticationResult> {
    let shouldContinue = await authentication.performDynamic('continue-before-log-in?', payload)
    if (!shouldContinue) return { status: 'failure', message: 'log-in-not-allowed' }

    const { email, password } = payload
    const authenticatable = await authentication.performDynamic('authenticatable-from-email', { email })

    if (authenticatable) {
      shouldContinue = await authentication.performDynamic('continue-after-authenticatable-found?', { authenticatable })
      if (!shouldContinue) return { status: 'failure', message: 'log-in-not-allowed' }

      const encryptedPassword = await authentication.performDynamicSync('get-authenticatable-encrypted-password', { authenticatable })
      const passwordCheck = authentication.performDynamicSync('do-passwords-match?', { encryptedPassword, password })

      if (passwordCheck) {
        await authentication.performDynamic('after-log-in-success', { authenticatable })

        return { authenticatable, status: 'success' }
      } else {
        await authentication.performDynamic('after-log-in-failure', { authenticatable })
      }
    } else {
      await authentication.performDynamic('after-log-in-authenticatable-not-found', { email })
    }

    return { status: 'failure', message: 'invalid-credentials' }
  }
}

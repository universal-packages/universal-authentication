import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { AuthenticationResult, DefaultModuleDynamicNames, EmailPayload } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'request-password-reset', true)
export default class RequestPasswordResetDynamic {
  public async perform(payload: EmailPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { email } = payload

    const authenticatable = await authentication.performDynamic('authenticatable-from-email', { email })

    if (authenticatable) {
      const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'password-reset', identifier: email })

      await authentication.performDynamic('send-password-reset', { authenticatable, oneTimePassword })

      return { status: 'success' }
    }

    return { status: 'warning', message: 'nothing-to-do' }
  }
}

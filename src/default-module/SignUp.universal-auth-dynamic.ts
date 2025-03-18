import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { AuthenticationResult, DefaultModuleDynamicNames, EmailPasswordLocalePayload } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'sign-up', true)
export default class SignUpDynamic {
  public async perform(payload: EmailPasswordLocalePayload, authentication: Authentication<DefaultModuleDynamicNames>): Promise<AuthenticationResult> {
    let shouldContinue = await authentication.performDynamic('continue-before-sign-up?', payload)
    if (!shouldContinue) return { status: 'failure', message: 'sign-up-not-allowed' }

    const { email, password, locale } = payload
    const validation = await authentication.performDynamic('validate-sign-up', { email, password })

    if (validation.valid) {
      const encryptedPassword = authentication.performDynamicSync('encrypt-password', { password })

      const user = await authentication.performDynamic('create-user', { attributes: { email, encryptedPassword, locale } })

      await authentication.performDynamic('send-welcome', { user })

      await authentication.performDynamic('after-sign-up-success', { user })

      return { status: 'success', user }
    }

    await authentication.performDynamic('after-sign-up-failure', { email, password, validation })

    return { status: 'failure', validation }
  }
}

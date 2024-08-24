import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { AuthenticationResult, DefaultModuleDynamicNames, EmailPasswordPayload } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'sign-up', true)
export default class SignUpDynamic {
  public async perform(payload: EmailPasswordPayload, authentication: Authentication): Promise<AuthenticationResult> {
    let shouldContinue = await authentication.performDynamic('continue-before-sign-up?', payload)
    if (!shouldContinue) return { status: 'failure', message: 'sign-up-not-allowed' }

    const { email, password } = payload
    const validation = await authentication.performDynamic('validate-sign-up', { email, password })

    if (validation.valid) {
      const authenticatable = authentication.performDynamicSync('authenticatable-from-sign-up-attributes', { email, password })
      await authentication.performDynamic('save-authenticatable', { authenticatable })

      await authentication.performDynamic('send-welcome', { authenticatable })

      await authentication.performDynamic('after-sign-up-success', { authenticatable })

      return { status: 'success', authenticatable }
    }

    await authentication.performDynamic('after-sign-up-failure', { email, password, validation })

    return { status: 'failure', validation }
  }
}

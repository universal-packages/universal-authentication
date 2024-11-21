import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { AuthenticationResult, DefaultModuleDynamicNames, UpdateEmailPasswordPayload } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'update-email-password', true)
export default class UpdateEmailPasswordDynamic {
  public async perform(payload: UpdateEmailPasswordPayload, authentication: Authentication<DefaultModuleDynamicNames>): Promise<AuthenticationResult> {
    const { user, email, password } = payload

    const currentEmail = authentication.performDynamicSync('get-user-current-email', { user })
    const validation = await authentication.performDynamic('validate-update', { currentEmail, email, password })

    if (validation.valid) {
      const attributes = {}

      if (email) attributes['email'] = email
      if (password) attributes['encryptedPassword'] = authentication.performDynamicSync('encrypt-password', { password })

      const updatedUser = await authentication.performDynamic('update-user', { user, attributes })

      await authentication.performDynamic('after-update-success', { user })

      return { status: 'success', user: updatedUser }
    }

    return { status: 'failure', validation }
  }
}

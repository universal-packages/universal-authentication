import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { AuthenticationResult, DefaultModuleDynamicNames, UpdateEmailPasswordPayload } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'update-email-password', true)
export default class UpdateEmailPasswordDynamic {
  public async perform(payload: UpdateEmailPasswordPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { authenticatable, email, password } = payload

    const validation = await authentication.performDynamic('validate-update', { authenticatable, email, password })

    if (validation.valid) {
      authentication.performDynamicSync('set-authenticatable-update-attributes', { authenticatable, email, password })
      await authentication.performDynamic('save-authenticatable', { authenticatable })

      await authentication.performDynamic('after-update-success', { authenticatable })

      return { status: 'success', authenticatable }
    }

    return { status: 'failure', validation }
  }
}

import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, UpdateAuthenticatablePayload } from '../../types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('update-authenticatable', true)
export default class UpdateAuthenticatableDynamic {
  public async perform(payload: UpdateAuthenticatablePayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { attributes, authenticatable } = payload

    const validation = await authentication.performDynamic('validate-attributes', { attributes, exclude: ['email', 'phone'], allOptional: true })

    if (validation.valid) {
      authentication.performDynamicSync('set-authenticatable-attributes', { authenticatable, attributes, exclude: ['email', 'phone'] })
      await authentication.performDynamic('save-authenticatable', { authenticatable })

      return { status: 'success', authenticatable }
    }

    return { status: 'failure', validation }
  }
}

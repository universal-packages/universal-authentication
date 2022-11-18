import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, UpdateCredentialPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('update-credential', true)
export default class UpdateCredentialDynamic {
  public async perform(payload: UpdateCredentialPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { authenticatable, credential, credentialKind } = payload

    const validation = await authentication.performDynamic('validate-attributes', { attributes: { [credentialKind]: credential }, include: [credentialKind] })

    if (validation.valid) {
      authentication.performDynamicSync('set-authenticatable-attributes', { authenticatable, attributes: { [credentialKind]: credential }, include: [credentialKind] })
      await authentication.performDynamic('save-authenticatable', { authenticatable })

      return { status: 'success', authenticatable }
    }

    return { status: 'failure', validation }
  }
}

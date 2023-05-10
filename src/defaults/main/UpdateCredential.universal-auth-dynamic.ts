import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, Corroboration, UpdateCredentialPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('update-credential', true)
export default class UpdateCredentialDynamic {
  public async perform(payload: UpdateCredentialPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { authenticatable, corroborationToken, credential, credentialKind } = payload

    const validation = await authentication.performDynamic('validate-attributes', { attributes: { [credentialKind]: credential }, include: [credentialKind] })

    if (validation.valid) {
      const credentialKindOptions = authentication.options[credentialKind]
      let corroboration: Corroboration

      if (credentialKindOptions.enableCorroboration) {
        corroboration = authentication.performDynamicSync('decrypt-corroboration-token', { token: corroborationToken })

        if (!corroboration) {
          if (corroborationToken) {
            return { status: 'failure', message: 'invalid-corroboration' }
          }

          return { status: 'failure', message: 'corroboration-required' }
        }
      }

      if (credentialKindOptions.enableConfirmation) {
        if (corroboration) {
          authentication.performDynamicSync('set-authenticatable-attributes', { authenticatable, attributes: { [credentialKind]: credential }, include: [credentialKind] })
          authentication.performDynamicSync('set-authenticatable-confirmed', { authenticatable, credentialKind })
        } else {
          authentication.performDynamicSync('set-authenticatable-unconfirmed-credential', { authenticatable, credential, credentialKind })
        }
      } else {
        authentication.performDynamicSync('set-authenticatable-attributes', { authenticatable, attributes: { [credentialKind]: credential }, include: [credentialKind] })
      }

      await authentication.performDynamic('save-authenticatable', { authenticatable })

      if (credentialKindOptions.enableConfirmation && !corroboration) {
        await authentication.performDynamic('request-confirmation', { credential, credentialKind })
      }

      return { status: 'success', authenticatable }
    }

    return { status: 'failure', validation }
  }
}

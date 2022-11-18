import Authentication from '../../Authentication'
import { AttributesValidationOptions, AuthDynamicNames, AuthenticationResult, Corroboration, Invitation, SignUpPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('sign-up', true)
export default class SignUpDynamic {
  public async perform(payload: SignUpPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { attributes, credentialKind, corroborationToken, invitationToken } = payload
    const credentialKindOptions = authentication.options[credentialKind]
    let invitation: Invitation
    let corroboration: Corroboration

    if (credentialKindOptions.enableSignUpInvitations) {
      try {
        invitation = authentication.performDynamicSync('decrypt-invitation-token', { credential: attributes[credentialKind], credentialKind, token: invitationToken })

        if (!invitation) {
          if (invitationToken) {
            return { status: 'failure', message: 'invalid-invitation' }
          }

          if (credentialKindOptions.enforceSignUpInvitations) {
            return { status: 'failure', message: 'invitation-required' }
          }
        }
      } catch {
        return { status: 'failure', message: 'invalid-invitation' }
      }
    }

    if (!invitation && credentialKindOptions.enableSignUpCorroboration) {
      try {
        corroboration = authentication.performDynamicSync('decrypt-corroboration-token', { credential: attributes[credentialKind], credentialKind, token: corroborationToken })

        if (!corroboration) {
          if (corroborationToken) {
            return { status: 'failure', message: 'invalid-corroboration' }
          }

          return { status: 'failure', message: 'corroboration-required' }
        }
      } catch {
        return { status: 'failure', message: 'invalid-corroboration' }
      }
    }

    const exclude: (keyof AttributesValidationOptions)[] = credentialKind === 'email' ? ['phone'] : ['email']
    const validation = await authentication.performDynamic('validate-attributes', { attributes, exclude })

    if (validation.valid) {
      const authenticatable = await authentication.performDynamic('authenticatable-from-sign-up', { attributes, credentialKind, corroboration, invitation })
      await authentication.performDynamic('save-authenticatable', { authenticatable })

      if (credentialKindOptions.enableConfirmation) {
        if (!authentication.performDynamicSync('is-authenticatable-confirmed?', { authenticatable, credentialKind })) {
          await authentication.performDynamic('request-confirmation', { authenticatable, credentialKind })

          if (credentialKindOptions.enforceConfirmation) {
            return { status: 'warning', message: 'confirmation-inbound', metadata: { credential: authenticatable[credentialKind], credentialKind } }
          } else {
            return { status: 'success', authenticatable }
          }
        }
      }

      return { status: 'success', authenticatable }
    }

    return { status: 'failure', validation }
  }
}

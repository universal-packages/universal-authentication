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
      invitation = authentication.performDynamicSync('decrypt-invitation-token', { token: invitationToken })

      if (!invitation) {
        if (invitationToken) {
          return { status: 'failure', message: 'invalid-invitation' }
        }

        if (credentialKindOptions.enforceSignUpInvitations) {
          return { status: 'failure', message: 'invitation-required' }
        }
      }
    }

    if (!invitation && credentialKindOptions.enableSignUpCorroboration) {
      corroboration = authentication.performDynamicSync('decrypt-corroboration-token', { token: corroborationToken })

      if (!corroboration) {
        if (corroborationToken) {
          return { status: 'failure', message: 'invalid-corroboration' }
        }

        return { status: 'failure', message: 'corroboration-required' }
      }
    }

    const exclude: (keyof AttributesValidationOptions)[] = credentialKind === 'email' ? ['phone'] : ['email']

    const shouldValidatePassword = (!!attributes.password && credentialKindOptions.enablePasswordCheck) || credentialKindOptions.enforcePasswordCheck
    if (!shouldValidatePassword) exclude.push('password')

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

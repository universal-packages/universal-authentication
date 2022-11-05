import Authentication from '../Authentication'
import { AuthenticationResult, AuthDynamicPayload, AuthDynamicNames, SignUpPayload, InvitationPayload, CorroborationPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('sign-up', true)
export default class SignUpDynamic {
  public async perform(payload: AuthDynamicPayload<SignUpPayload>, authentication: Authentication): Promise<AuthenticationResult> {
    const { credentialKind } = payload.body
    const credentialKindOptions = payload.authOptions[credentialKind]
    let invitationPayload: InvitationPayload
    let corroborationPayload: CorroborationPayload

    if (credentialKindOptions.enableSignUpInvitations) {
      invitationPayload = authentication.performDynamicSync('decrypt-invitation-token', { token: payload.body.invitationToken })

      if (invitationPayload) {
        if (invitationPayload.credentialKind !== credentialKind) {
          return { status: 'failure', message: 'invalid-invitation' }
        }
      } else if (credentialKindOptions.enforceSignUpInvitations) {
        return { status: 'failure', message: 'invitation-required' }
      }
    }

    if (!invitationPayload && credentialKindOptions.enableSignUpCorroboration) {
      corroborationPayload = authentication.performDynamicSync('decrypt-corroboration-token', { token: payload.body.corroborationToken })

      if (corroborationPayload) {
        if (corroborationPayload.credentialKind !== credentialKind) {
          return { status: 'failure', message: 'invalid-corroboration' }
        }
      } else {
        return { status: 'failure', message: 'corroboration-required' }
      }
    }

    if (corroborationPayload || invitationPayload) {
      authentication.performDynamicSync('refine-sign-up-payload', {
        corroborationPayload: corroborationPayload,
        invitationPayload: invitationPayload,
        signUpPayload: payload.body
      })
    }

    const validation = await authentication.performDynamic('validate-sign-up-payload', payload.body)

    if (validation.valid) {
      const authenticatable = await authentication.performDynamic('authenticatable-from-sign-up', { signUpPayload: payload.body, corroborationPayload, invitationPayload })
      await authentication.performDynamic('save-authenticatable', { authenticatable })

      if (credentialKindOptions.enableConfirmation) {
        if (!authentication.performDynamicSync('is-authenticatable-confirmed?', { authenticatable, credentialKind })) {
          await authentication.performDynamic('send-confirmation-request', { authenticatable, credentialKind })

          if (credentialKindOptions.enforceConfirmation) {
            return { status: 'warning', message: 'confirmation-inbound' }
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

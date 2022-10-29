import Authentication from '../Authentication'
import { AuthenticationResult, AuthDynamicPayload, SignUpPayload, AuthenticatableFromSignUpPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('sign-up', true)
export default class SignUpDynamic {
  public async perform(payload: AuthDynamicPayload<SignUpPayload>, authentication: Authentication): Promise<AuthenticationResult> {
    const invitationPayload = payload.authOptions.enableInvitations
      ? authentication.performDynamicSync('decrypt-invitation-token', { token: payload.body.invitationToken })
      : undefined

    if (!invitationPayload && payload.authOptions.enforceInvitations) {
      return { status: 'failure', validation: { errors: { invitation: ['invitation-required'] }, valid: false } }
    }

    const validation = await authentication.performDynamic('validate-sign-up-payload', payload.body)

    if (validation.valid) {
      const authenticatableFromSignUpPayload: AuthenticatableFromSignUpPayload = { signUpPayload: payload.body, invitationPayload }
      const authenticatable = await authentication.performDynamic('authenticatable-from-sign-up', authenticatableFromSignUpPayload)

      return { status: 'success', authenticatable, validation }
    }

    return { status: 'failure', validation }
  }
}

import Authentication from '../Authentication'
import { AuthenticationResult, AuthDynamicPayload, SignUpBody, SignUpPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('sign-up', true)
export default class SignUpDynamic {
  public async perform(payload: AuthDynamicPayload<SignUpBody>, authentication: Authentication): Promise<AuthenticationResult> {
    const invitation = payload.authOptions.enableInvitations ? authentication.performDynamicSync('decrypt-invitation-token', { token: payload.body.invitationToken }) : undefined

    if (!invitation && payload.authOptions.enforceInvitations) {
      return { state: 'failure', validation: { errors: { invitation: ['incitation-required'] }, valid: false } }
    }

    const validation = await authentication.performDynamic('validate-sign-up-body', payload.body)

    if (validation.valid) {
      const signUpPayload: SignUpPayload = { body: payload.body, invitation }
      const authenticatable = await authentication.performDynamic('authenticatable-from-sign-up-payload', signUpPayload)

      return { state: 'success', authenticatable, validation }
    }

    return { state: 'failure', validation }
  }
}

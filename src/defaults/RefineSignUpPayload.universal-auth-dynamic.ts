import { AuthDynamicNames, AuthDynamicPayload, SignUpPayloadRefinementPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('refine-sign-up-payload', true)
export default class RefineSignUpPayloadDynamic {
  public perform(payload: AuthDynamicPayload<SignUpPayloadRefinementPayload>): void {
    const { signUpPayload, invitationPayload, corroborationPayload } = payload.body
    const { credentialKind } = signUpPayload

    signUpPayload[credentialKind] = invitationPayload?.credential || corroborationPayload?.credential

    switch (credentialKind) {
      case 'email':
        signUpPayload.phone = null
        break
      case 'phone':
        signUpPayload.email = null
        break
    }
  }
}

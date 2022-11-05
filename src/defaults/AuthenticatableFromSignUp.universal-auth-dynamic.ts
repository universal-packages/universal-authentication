import { Authenticatable, AuthDynamicPayload, AuthDynamicNames, AuthenticatableFromSignUpPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('authenticatable-from-sign-up', true)
export default class AuthenticatableFromSignUpDynamic {
  public async perform(payload: AuthDynamicPayload<AuthenticatableFromSignUpPayload>): Promise<Authenticatable> {
    const authenticatable = new payload.Authenticatable()
    const { signUpPayload, invitationPayload, corroborationPayload } = payload.body
    const { credentialKind } = signUpPayload
    const credentialKindOptions = payload.authOptions[credentialKind]

    authenticatable.username = payload.body.signUpPayload.username
    authenticatable.firstName = payload.body.signUpPayload.firstName
    authenticatable.lastName = payload.body.signUpPayload.lastName
    authenticatable.name = payload.body.signUpPayload.name
    authenticatable.password = payload.body.signUpPayload.password

    if (invitationPayload) authenticatable.inviterId = invitationPayload.inviterId

    authenticatable[credentialKind] = (invitationPayload?.credential || corroborationPayload?.credential || signUpPayload[credentialKind]).toLowerCase()

    if (invitationPayload || corroborationPayload) {
      if (credentialKindOptions.enableConfirmation) authenticatable[`${credentialKind}ConfirmedAt`] = new Date()
    }

    return authenticatable
  }
}

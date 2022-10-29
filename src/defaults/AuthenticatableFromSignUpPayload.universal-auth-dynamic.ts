import { Authenticatable, AuthDynamicPayload, AuthenticatableFromSignUpPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('authenticatable-from-sign-up-payload', true)
export default class AuthenticatableFromSignUpPayloadDynamic {
  public async perform(payload: AuthDynamicPayload<AuthenticatableFromSignUpPayload>): Promise<Authenticatable> {
    const authenticatable = new payload.Authenticatable()

    authenticatable.email = payload.body.invitationPayload?.invitedEmail || payload.body.signUpPayload.email.toLowerCase()
    authenticatable.username = payload.body.signUpPayload.username
    authenticatable.firstName = payload.body.signUpPayload.firstName
    authenticatable.lastName = payload.body.signUpPayload.lastName
    authenticatable.name = payload.body.signUpPayload.name
    authenticatable.password = payload.body.signUpPayload.password
    authenticatable.inviterId = payload.body.invitationPayload?.inviterId
    authenticatable.confirmedAt = payload.body.invitationPayload ? new Date() : null

    await authenticatable.save()

    return authenticatable
  }
}

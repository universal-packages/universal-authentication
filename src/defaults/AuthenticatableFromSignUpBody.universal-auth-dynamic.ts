import { Authenticatable, AuthDynamicPayload, SignUpPayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic('authenticatable-from-sign-up-payload', true)
export default class AuthenticatableFromSignUpBodyDynamic {
  public async perform(payload: AuthDynamicPayload<SignUpPayload>): Promise<Authenticatable> {
    const authenticatable = new payload.Authenticatable()

    authenticatable.email = payload.body.invitation?.invitedEmail || payload.body.body.email.toLowerCase()
    authenticatable.username = payload.body.body.username
    authenticatable.firstName = payload.body.body.firstName
    authenticatable.lastName = payload.body.body.lastName
    authenticatable.name = payload.body.body.name
    authenticatable.password = payload.body.body.password
    authenticatable.inviterId = payload.body.invitation?.inviterId
    authenticatable.confirmedAt = payload.body.invitation ? new Date() : null

    await authenticatable.save()

    return authenticatable
  }
}

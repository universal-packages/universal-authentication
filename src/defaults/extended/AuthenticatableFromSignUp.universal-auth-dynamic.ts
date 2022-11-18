import Authentication from '../../Authentication'
import { AuthDynamicNames, Authenticatable, AuthenticatableFromSignUpPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('authenticatable-from-sign-up', true)
export default class AuthenticatableFromSignUpDynamic {
  public async perform(payload: AuthenticatableFromSignUpPayload, authentication: Authentication): Promise<Authenticatable> {
    const authenticatable = new authentication.Authenticatable()
    const { attributes, credentialKind, corroboration, invitation } = payload
    const credentialKindOptions = authentication.options[credentialKind]

    authenticatable[credentialKind] = attributes[credentialKind].toLowerCase()
    authenticatable.username = attributes.username
    authenticatable.firstName = attributes.firstName
    authenticatable.lastName = attributes.lastName
    authenticatable.name = attributes.name

    if (credentialKindOptions.enablePasswordCheck) authentication.performDynamicSync('set-authenticatable-password', { authenticatable, password: attributes.password })

    if (invitation) authenticatable.inviterId = invitation.inviterId

    if (invitation || corroboration) {
      if (credentialKindOptions.enableConfirmation) authenticatable[`${credentialKind}ConfirmedAt`] = new Date()
    }

    return authenticatable
  }
}

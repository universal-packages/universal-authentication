import Authentication from '../../Authentication'
import { AssignableAttributes, AuthDynamicNames, Authenticatable, AuthenticatableFromSignUpPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('authenticatable-from-sign-up', true)
export default class AuthenticatableFromSignUpDynamic {
  public async perform(payload: AuthenticatableFromSignUpPayload, authentication: Authentication): Promise<Authenticatable> {
    const authenticatable = new authentication.Authenticatable()
    const { attributes, credentialKind, corroboration, invitation } = payload
    const credentialKindOptions = authentication.options[credentialKind]
    const include: (keyof AssignableAttributes)[] = [credentialKind, 'firstName', 'lastName', 'name', 'username']

    if (credentialKindOptions.enablePasswordCheck) include.push('password')

    authentication.performDynamicSync('set-authenticatable-attributes', {
      authenticatable,
      attributes,
      include
    })

    if (invitation) authenticatable.inviterId = invitation.inviterId

    if (invitation || corroboration) {
      if (credentialKindOptions.enableConfirmation) {
        authentication.performDynamicSync('set-authenticatable-confirmed', { authenticatable, credentialKind })
      }
    }

    return authenticatable
  }
}

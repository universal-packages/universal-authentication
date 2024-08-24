import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { Authenticatable, DefaultModuleAuthenticatableClass, DefaultModuleDynamicNames, EmailPasswordPayload } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'authenticatable-from-sign-up-attributes', true)
export default class AuthenticatableFromSignUpAttributesDynamic {
  public perform(payload: EmailPasswordPayload, authentication: Authentication): Authenticatable {
    const AuthenticatableClass = authentication.Authenticatable as DefaultModuleAuthenticatableClass
    const authenticatable = new AuthenticatableClass()

    authenticatable['email'] = payload.email
    authenticatable['password'] = payload.password

    return authenticatable
  }
}

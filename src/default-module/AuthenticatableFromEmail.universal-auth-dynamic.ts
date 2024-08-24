import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { DefaultModuleAuthenticatable, DefaultModuleAuthenticatableClass, DefaultModuleDynamicNames, EmailPayload } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'authenticatable-from-email', true)
export default class AuthenticatableFromCredentialDynamic {
  public async perform(payload: EmailPayload, authentication: Authentication): Promise<DefaultModuleAuthenticatable> {
    const AuthenticatableClass = authentication.Authenticatable as DefaultModuleAuthenticatableClass
    const authenticatable = await AuthenticatableClass.fromEmail(payload.email)

    return authenticatable
  }
}

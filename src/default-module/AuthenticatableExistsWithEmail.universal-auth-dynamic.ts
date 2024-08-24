import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { DefaultModuleAuthenticatableClass, DefaultModuleDynamicNames, EmailPayload } from '../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'authenticatable-exists-with-email?', true)
export default class AuthenticatableExistsWithEmailDynamic {
  public async perform(payload: EmailPayload, authentication: Authentication): Promise<boolean> {
    const AuthenticatableClass = authentication.Authenticatable as DefaultModuleAuthenticatableClass

    return await AuthenticatableClass.existsWithEmail(payload.email)
  }
}

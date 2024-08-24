import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { AuthenticatableEmailPasswordPayload, DefaultModuleDynamicNames, DefaultModuleOptions, ValidationResult } from '../types'
import SignUpValidation from './validations/SignUpValidation'
import UpdateValidation from './validations/UpdateValidation'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'validate-update', true)
export default class ValidateSignUpDynamic {
  private readonly options: DefaultModuleOptions

  public constructor(options: DefaultModuleOptions) {
    this.options = options
  }

  public async perform(payload: AuthenticatableEmailPasswordPayload, authentication: Authentication): Promise<ValidationResult> {
    const { authenticatable, email, password } = payload

    return await new UpdateValidation(authentication, authenticatable, this.options).validate({ email, password })
  }
}

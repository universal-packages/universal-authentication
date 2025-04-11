import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { DefaultModuleDynamicNames, DefaultModuleOptions, PasswordPayload, ValidationResult } from '../types'
import UserValidation from './validations/UserValidation'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'validate-password-reset', true)
export default class ValidateSignUpAttributesDynamic {
  private readonly options: DefaultModuleOptions

  public constructor(options: DefaultModuleOptions) {
    this.options = options
  }

  public async perform(payload: PasswordPayload, authentication: Authentication<DefaultModuleDynamicNames>): Promise<ValidationResult> {
    return await new UserValidation(payload, authentication, this.options).validate(payload, 'reset-password')
  }
}

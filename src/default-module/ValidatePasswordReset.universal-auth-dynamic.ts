import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { DefaultModuleDynamicNames, DefaultModuleOptions, PasswordOneTimePasswordPayload, ValidationResult } from '../types'
import DefaultModuleValidation from './validations/DefaultModuleValidation'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'validate-password-reset', true)
export default class ValidateSignUpAttributesDynamic {
  private readonly options: DefaultModuleOptions

  public constructor(options: DefaultModuleOptions) {
    this.options = options
  }

  public async perform(payload: PasswordOneTimePasswordPayload, authentication: Authentication<DefaultModuleDynamicNames>): Promise<ValidationResult> {
    return await new DefaultModuleValidation({}, authentication, this.options).validate(payload, 'reset-password')
  }
}

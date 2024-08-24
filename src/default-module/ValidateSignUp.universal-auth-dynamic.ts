import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { DefaultModuleDynamicNames, DefaultModuleOptions, EmailPasswordPayload, ValidationResult } from '../types'
import SignUpValidation from './validations/SignUpValidation'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'validate-sign-up', true)
export default class ValidateSignUpDynamic {
  private readonly options: DefaultModuleOptions

  public constructor(options: DefaultModuleOptions) {
    this.options = options
  }

  public async perform(payload: EmailPasswordPayload, authentication: Authentication): Promise<ValidationResult> {
    return await new SignUpValidation(authentication, this.options).validate(payload)
  }
}

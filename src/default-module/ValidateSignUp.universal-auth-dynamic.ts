import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { DefaultModuleDynamicNames, DefaultModuleOptions, EmailPasswordPayload, ValidationResult } from '../types'
import UserValidation from './validations/UserValidation'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'validate-sign-up', true)
export default class ValidateSignUpDynamic {
  private readonly options: DefaultModuleOptions

  public constructor(options: DefaultModuleOptions) {
    this.options = options
  }

  public async perform(payload: EmailPasswordPayload, authentication: Authentication<DefaultModuleDynamicNames>): Promise<ValidationResult> {
    return await new UserValidation(payload, authentication, this.options).validate(payload, 'sign-up')
  }
}

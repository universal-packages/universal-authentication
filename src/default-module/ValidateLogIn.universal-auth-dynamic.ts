import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { DefaultModuleDynamicNames, DefaultModuleOptions, EmailPasswordPayload, ValidationResult } from '../types'
import UserValidation from './validations/UserValidation'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'validate-log-in', true)
export default class ValidateLogInDynamic {
  private readonly options: DefaultModuleOptions

  public constructor(options: DefaultModuleOptions) {
    this.options = options
  }

  public async perform(payload: EmailPasswordPayload, authentication: Authentication<DefaultModuleDynamicNames>): Promise<ValidationResult> {
    return await new UserValidation(payload, authentication, this.options).validate(payload, 'log-in')
  }
}

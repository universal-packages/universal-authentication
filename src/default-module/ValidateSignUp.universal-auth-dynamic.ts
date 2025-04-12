import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { DefaultModuleDynamicNames, DefaultModuleOptions, EmailPasswordAndDetailsPayload, ValidationResult } from '../types'
import DefaultModuleValidation from './validations/DefaultModuleValidation'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'validate-sign-up', true)
export default class ValidateSignUpDynamic {
  private readonly options: DefaultModuleOptions

  public constructor(options: DefaultModuleOptions) {
    this.options = options
  }

  public async perform(payload: EmailPasswordAndDetailsPayload, authentication: Authentication<DefaultModuleDynamicNames>): Promise<ValidationResult> {
    return await new DefaultModuleValidation({}, authentication, this.options).validate(payload, ['sign-up', 'sign-up-backend', 'initial-details'])
  }
}

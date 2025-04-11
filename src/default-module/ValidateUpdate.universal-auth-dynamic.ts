import Authentication from '../Authentication'
import { AuthDynamic } from '../decorators'
import { DefaultModuleDynamicNames, DefaultModuleOptions, EmailPasswordCurrentEmailPayload, ValidationResult } from '../types'
import DefaultModuleValidation from './validations/DefaultModuleValidation'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'validate-update', true)
export default class ValidateSignUpDynamic {
  private readonly options: DefaultModuleOptions

  public constructor(options: DefaultModuleOptions) {
    this.options = options
  }

  public async perform(payload: EmailPasswordCurrentEmailPayload, authentication: Authentication<DefaultModuleDynamicNames>): Promise<ValidationResult> {
    const { currentEmail, email, password } = payload

    return await new DefaultModuleValidation({ email: currentEmail }, authentication, this.options).validate({ email, password }, 'update')
  }
}

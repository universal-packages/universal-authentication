import { AuthDynamic } from '../decorators'
import { DefaultModuleDynamicNames, DefaultModuleOptions, PasswordPayload, ValidationResult } from '../types'
import PasswordResetValidation from './validations/PasswordResetValidation'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'validate-password-reset', true)
export default class ValidateSignUpAttributesDynamic {
  private readonly options: DefaultModuleOptions

  public constructor(options: DefaultModuleOptions) {
    this.options = options
  }

  public async perform(payload: PasswordPayload): Promise<ValidationResult> {
    return await new PasswordResetValidation(this.options).validate(payload)
  }
}

import { BaseValidation, Validator } from '@universal-packages/validations'
import validator from 'validator'

import { DefaultModuleOptions } from '../../types'

export default class PasswordResetValidation extends BaseValidation {
  public readonly options: DefaultModuleOptions

  public constructor(options: DefaultModuleOptions) {
    super()
    this.options = options
  }

  @Validator('password', { message: 'empty-password' })
  public passwordEmpty(password: string): boolean {
    if (!password) return false
    return true
  }

  @Validator('password', { priority: 1, message: 'password-out-of-size' })
  public passwordLength(password: string): boolean {
    if (this.options.passwordValidation?.size) return validator.isLength(password, this.options.passwordValidation.size)
    return validator.isLength(password, { min: 8, max: 256 })
  }
}

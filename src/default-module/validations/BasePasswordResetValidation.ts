import { BaseValidation, Validator } from '@universal-packages/validations'
import validator from 'validator'

export default class BasePasswordResetValidation extends BaseValidation {
  protected passwordSize: { min?: number; max?: number } = { min: 8, max: 256 }

  @Validator('password', { message: 'empty-password' })
  public validatePasswordEmpty(password: string): boolean {
    if (!password) return false
    return true
  }

  @Validator('password', { priority: 1, message: 'password-out-of-size' })
  public validatePasswordLength(password: string): boolean {
    return validator.isLength(password, this.passwordSize)
  }
}

import { BaseValidation, Validator } from '@universal-packages/validations'
import validator from 'validator'

export default class BaseSignUpValidation extends BaseValidation {
  protected emailMatcher?: RegExp
  protected emailSize: { min?: number; max?: number } = { min: 1, max: 256 }

  @Validator('email', { message: 'empty-email' })
  public emailEmpty(email: string): boolean {
    if (!email) return false
    return true
  }

  @Validator('email', { priority: 1, message: 'invalid-email' })
  public validateEmailFormat(email: string): boolean {
    if (this.emailMatcher) return validator.matches(email, this.emailMatcher)
    return validator.isEmail(email)
  }

  @Validator('email', { priority: 1, message: 'email-out-of-size' })
  public validateEmailSize(email: string): boolean {
    return validator.isLength(email, this.emailSize)
  }

  @Validator('email', { priority: 2, message: 'email-in-use' })
  public async emailUnique(email: string): Promise<boolean> {
    return !(await this.authentication.performDynamic('user-exists-with-email?', { email }))
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

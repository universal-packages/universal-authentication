import { BaseValidation, Validator } from '@universal-packages/validations'
import validator from 'validator'

export default class BaseUserValidation extends BaseValidation {
  protected emailMatcher?: RegExp
  protected emailSize: { min?: number; max?: number } = { min: 1, max: 256 }

  @Validator('email', { message: 'email-should-be-present', schema: ['sign-up', 'update', 'log-in'] })
  public validateEmailPresence(email: string): boolean {
    return !!email
  }

  @Validator('email', { priority: 1, message: 'email-should-be-of-valid-size', schema: ['sign-up', 'update', 'log-in'] })
  public validateEmailSize(email: string): boolean {
    return validator.isLength(email, this.emailSize)
  }

  @Validator('email', { priority: 2, message: 'email-should-be-valid', schema: ['sign-up', 'update', 'log-in'] })
  public validateEmailFormat(email: string): boolean {
    if (this.emailMatcher) return validator.matches(email, this.emailMatcher)
    return validator.isEmail(email)
  }
}

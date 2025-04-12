import { Validator } from '@universal-packages/validations'
import validator from 'validator'

import InitialDetailsValidation from '../../validations/InitialDetailsValidation'

export default class BaseDefaultModuleValidation extends InitialDetailsValidation {
  protected emailMatcher?: RegExp
  protected emailSize?: { min?: number; max?: number } = { min: 6, max: 256 }
  protected passwordSize?: { min?: number; max?: number } = { min: 8, max: 256 }

  @Validator('email', { message: 'email-should-be-present', schema: ['request-password-reset', 'sign-up', 'log-in', { for: 'update', options: { optional: true } }] })
  public validateEmailPresence(email: string): boolean {
    if (!email) return false
    return true
  }

  @Validator('email', {
    priority: 1,
    message: 'email-should-be-right-sized',
    schema: ['request-password-reset', 'sign-up', 'log-in', { for: 'update', options: { optional: true } }]
  })
  public validateEmailSize(email: string): boolean {
    return validator.isLength(email, this.emailSize)
  }

  @Validator('email', { priority: 2, message: 'email-should-be-valid', schema: ['request-password-reset', 'sign-up', 'log-in', { for: 'update', options: { optional: true } }] })
  public validateEmailFormat(email: string): boolean {
    if (this.emailMatcher) return validator.matches(email, this.emailMatcher)
    return validator.isEmail(email)
  }

  @Validator('email', { priority: 3, message: 'email-should-be-unique', schema: ['sign-up-backend', { for: 'update', options: { optional: true } }] })
  public async validateEmailUniqueness(email: string, initialEmail: string): Promise<boolean> {
    if (initialEmail && email === initialEmail) return true
    return !(await this.isEmailTaken(email))
  }

  @Validator('oneTimePassword', { message: 'one-time-password-should-be-present', schema: 'reset-password' })
  public oneTimePasswordEmpty(oneTimePassword: string): boolean {
    if (!oneTimePassword) return false
    return true
  }

  @Validator('oneTimePassword', { priority: 1, message: 'one-time-password-should-be-numeric', schema: 'reset-password' })
  public oneTimePasswordIsNumber(oneTimePassword: string): boolean {
    return validator.isNumeric(String(oneTimePassword))
  }

  @Validator('oneTimePassword', { priority: 1, message: 'one-time-password-should-be-right-sized', schema: 'reset-password' })
  public oneTimePasswordLength(oneTimePassword: string): boolean {
    return validator.isLength(String(oneTimePassword), { min: 6, max: 6 })
  }

  @Validator('password', { message: 'password-should-be-present', schema: ['sign-up', 'log-in', 'reset-password', { for: 'update', options: { optional: true } }] })
  public validatePasswordPresence(password: string): boolean {
    if (!password) return false
    return true
  }

  @Validator('password', {
    priority: 1,
    message: 'password-should-be-right-sized',
    schema: ['sign-up', 'log-in', 'reset-password', { for: 'update', options: { optional: true } }]
  })
  public validatePasswordSize(password: string): boolean {
    return validator.isLength(password, this.passwordSize)
  }

  protected isEmailTaken(_email: string): Promise<boolean> {
    throw new Error('Not implemented')
  }
}

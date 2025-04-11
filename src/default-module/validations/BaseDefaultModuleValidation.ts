import { BaseValidation, Validator } from '@universal-packages/validations'
import validator from 'validator'

export default class BaseDefaultModuleValidation extends BaseValidation {
  protected emailMatcher?: RegExp
  protected emailSize?: { min?: number; max?: number } = { min: 6, max: 256 }
  protected passwordSize?: { min?: number; max?: number } = { min: 8, max: 256 }
  protected localeOptional?: boolean = true
  protected timezoneOptional?: boolean = true

  @Validator('email', { message: 'email-should-be-present', schema: ['sign-up', 'log-in', { for: 'update', options: { optional: true } }] })
  public validateEmailPresence(email: string): boolean {
    if (!email) return false
    return true
  }

  @Validator('email', { priority: 1, message: 'email-should-be-right-sized', schema: ['sign-up', 'log-in', { for: 'update', options: { optional: true } }] })
  public validateEmailSize(email: string): boolean {
    return validator.isLength(email, this.emailSize)
  }

  @Validator('email', { priority: 2, message: 'email-should-be-valid', schema: ['sign-up', 'log-in', { for: 'update', options: { optional: true } }] })
  public validateEmailFormat(email: string): boolean {
    if (this.emailMatcher) return validator.matches(email, this.emailMatcher)
    return validator.isEmail(email)
  }

  @Validator('email', { priority: 3, message: 'email-should-be-unique', schema: ['sign-up', { for: 'update', options: { optional: true } }] })
  public async validateEmailUniqueness(email: string, initialEmail: string): Promise<boolean> {
    if (initialEmail && email === initialEmail) return true
    return !(await this.isEmailTaken(email))
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

  @Validator('locale', { message: 'locale-should-be-present', schema: ['sign-up', 'initial-details'] })
  public validateLocalePresence(locale: string): boolean {
    return this.localeOptional || !!locale
  }

  @Validator('locale', { priority: 1, message: 'locale-should-be-a-valid-locale', schema: ['sign-up', 'initial-details'] })
  public validateLocaleFormat(locale: string): boolean {
    if (!locale && this.localeOptional) return true
    return validator.isLocale(locale)
  }

  @Validator('timezone', { message: 'timezone-should-be-present', schema: ['sign-up', 'initial-details'] })
  public validateTimezonePresence(timezone: string): boolean {
    return this.timezoneOptional || !!timezone
  }

  @Validator('timezone', { priority: 1, message: 'timezone-should-be-a-valid-timezone', schema: ['sign-up', 'initial-details'] })
  public validateTimezoneFormat(timezone: string): boolean {
    if (!timezone && this.timezoneOptional) return true
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: timezone })
      return true
    } catch {
      return false
    }
  }
}

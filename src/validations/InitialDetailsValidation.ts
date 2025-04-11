import { BaseValidation, Validator } from '@universal-packages/validations'
import validator from 'validator'

export default class InitialDetailsValidation extends BaseValidation {
  protected localeOptional?: boolean = true
  protected timezoneOptional?: boolean = true

  @Validator('locale', { message: 'locale-should-be-present', schema: 'initial-details' })
  public validateLocalePresence(locale: string): boolean {
    return this.localeOptional || !!locale
  }

  @Validator('locale', { priority: 1, message: 'locale-should-be-a-valid-locale', schema: 'initial-details' })
  public validateLocaleFormat(locale: string): boolean {
    if (!locale && this.localeOptional) return true
    return validator.isLocale(locale)
  }

  @Validator('timezone', { message: 'timezone-should-be-present', schema: 'initial-details' })
  public validateTimezonePresence(timezone: string): boolean {
    return this.timezoneOptional || !!timezone
  }

  @Validator('timezone', { priority: 1, message: 'timezone-should-be-a-valid-timezone', schema: 'initial-details' })
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

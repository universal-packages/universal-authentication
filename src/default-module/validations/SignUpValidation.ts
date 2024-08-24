import { BaseValidation, Validator } from '@universal-packages/validations'
import validator from 'validator'

import Authentication from '../../Authentication'
import { DefaultModuleOptions } from '../../types'

export default class SignUpValidation extends BaseValidation {
  public readonly authentication: Authentication
  public readonly options: DefaultModuleOptions

  public constructor(authentication: Authentication, options: DefaultModuleOptions) {
    super()
    this.authentication = authentication
    this.options = options
  }

  @Validator('email', { message: 'empty-email' })
  public emailEmpty(email: string): boolean {
    if (!email) return false
    return true
  }

  @Validator('email', { priority: 1, message: 'invalid-email' })
  public emailFormat(email: string): boolean {
    if (this.options.emailValidation?.matcher) return validator.matches(email, this.options.emailValidation.matcher)
    return validator.isEmail(email)
  }

  @Validator('email', { priority: 1, message: 'email-out-of-size' })
  public emailSize(email: string): boolean {
    if (this.options.emailValidation?.size) return validator.isLength(email, this.options.emailValidation.size)
    return validator.isLength(email, { min: 1, max: 256 })
  }

  @Validator('email', { priority: 2, message: 'email-in-use' })
  public async emailUnique(email: string): Promise<boolean> {
    return !(await this.authentication.performDynamic('authenticatable-exists-with-email?', { email }))
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

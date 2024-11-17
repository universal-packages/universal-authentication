import { BaseValidation, Validator } from '@universal-packages/validations'
import validator from 'validator'

import Authentication from '../../Authentication'
import { DefaultModuleDynamicNames, DefaultModuleOptions } from '../../types'

export default class UpdateValidation extends BaseValidation {
  public readonly authentication: Authentication<DefaultModuleDynamicNames>
  public readonly currentEmail: string
  public readonly options: DefaultModuleOptions

  public constructor(authentication: Authentication<DefaultModuleDynamicNames>, currentEmail: string, options: DefaultModuleOptions) {
    super()
    this.authentication = authentication
    this.currentEmail = currentEmail
    this.options = options
  }

  @Validator('email', { message: 'invalid-email', optional: true })
  public emailFormat(email: string): boolean {
    if (this.options.emailValidation?.matcher) return validator.matches(email, this.options.emailValidation.matcher)
    return validator.isEmail(email)
  }

  @Validator('email', { message: 'email-out-of-size', optional: true })
  public emailSize(email: string): boolean {
    if (this.options.emailValidation?.size) return validator.isLength(email, this.options.emailValidation.size)
    return validator.isLength(email, { min: 1, max: 256 })
  }

  @Validator('email', { priority: 1, message: 'email-in-use', optional: true })
  public async emailUnique(email: string): Promise<boolean> {
    if (this.currentEmail === email) return true
    return !(await this.authentication.performDynamic('user-exists-with-email?', { email }))
  }

  @Validator('password', { priority: 1, message: 'password-out-of-size', optional: true })
  public passwordLength(password: string): boolean {
    if (this.options.passwordValidation?.size) return validator.isLength(password, this.options.passwordValidation.size)
    return validator.isLength(password, { min: 8, max: 256 })
  }
}

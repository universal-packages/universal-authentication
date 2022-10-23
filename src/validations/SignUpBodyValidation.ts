import validator from 'validator'
import { BaseValidation, Validator } from '@universal-packages/validations'
import { AuthenticatableClass, AuthenticationOptions } from '../index'

export default class SignUpBodyValidation extends BaseValidation {
  public readonly AuthenticatableClass: AuthenticatableClass
  public readonly authOptions: AuthenticationOptions

  public constructor(authenticatableClass: AuthenticatableClass, authOptions: AuthenticationOptions) {
    super()
    this.AuthenticatableClass = authenticatableClass
    this.authOptions = authOptions
  }

  @Validator('email', { message: 'email-invalid' })
  public emailFormat(email: string): boolean {
    if (this.authOptions.validations.email?.optional && (email === undefined || email === null)) return true
    return validator.isEmail(email)
  }

  @Validator('email', { priority: 1, message: 'email-in-use', inverse: true })
  public async emailUnique(email: string): Promise<boolean> {
    if (this.authOptions.validations.email?.optional && (email === undefined || email === null)) return false
    return !(await this.AuthenticatableClass.existsWithEmail(email))
  }

  @Validator('username', { message: 'username-invalid' })
  public usernameFormat(username: string): boolean {
    if (this.authOptions.validations.username?.optional && (username === undefined || username === null)) return true
    return validator.matches(username, this.authOptions.validations.username?.matcher || /^[a-zA-Z.0-9_\-&]+$/i)
  }

  @Validator('username', { message: 'username-not-in-size' })
  public usernameLength(username: string): boolean {
    if (this.authOptions.validations.username?.optional && (username === undefined || username === null)) return true
    return validator.isLength(username, this.authOptions.validations.username?.size || { min: 1, max: 128 })
  }

  @Validator('firstName', { message: 'first-name-not-in-size' })
  public firstNameLength(firstName: string): boolean {
    if (this.authOptions.validations.firstName?.optional && (firstName === undefined || firstName === null)) return true
    return validator.isLength(firstName, this.authOptions.validations.firstName?.size || { min: 1, max: 128 })
  }

  @Validator('lastName', { message: 'last-name-not-in-size' })
  public lastNameLength(lastName: string): boolean {
    if (this.authOptions.validations.lastName?.optional && (lastName === undefined || lastName === null)) return true
    return validator.isLength(lastName, this.authOptions.validations.lastName?.size || { min: 1, max: 128 })
  }

  @Validator('name', { message: 'name-not-in-size' })
  public nameLength(name: string): boolean {
    if (this.authOptions.validations.name?.optional && (name === undefined || name === null)) return true
    return validator.isLength(name, this.authOptions.validations.name?.size || { min: 1, max: 128 })
  }

  @Validator('username', { priority: 1, message: 'username_in_use', inverse: true })
  public async usernameUnique(username: string): Promise<boolean> {
    if (this.authOptions.validations.username?.optional && (username === undefined || username === null)) return false
    return !(await this.AuthenticatableClass.existsWithUsername(username))
  }

  @Validator('password', { message: 'password_not_in_size' })
  public passwordLength(password: string): boolean {
    if (this.authOptions.validations.password?.optional && (password === undefined || password === null)) return true
    return validator.isLength(password, this.authOptions.validations.password?.size || { min: 8, max: 128 })
  }
}

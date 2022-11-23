import validator from 'validator'
import { BaseValidation, Validator } from '@universal-packages/validations'
import { Authentication, AttributesValidationOptions } from '../index'

export default class AttributesValidation extends BaseValidation {
  public readonly authentication: Authentication
  public readonly options: AttributesValidationOptions
  public readonly allOptional: boolean

  public constructor(authentication: Authentication, options: AttributesValidationOptions, allOptional = false) {
    super()
    this.authentication = authentication
    this.options = options
    this.allOptional = allOptional
  }

  @Validator('email', { message: 'invalid-email' })
  public emailFormat(email: string): boolean {
    if (!this.options.email) return true
    if ((this.options.email.optional || this.allOptional) && (email === undefined || email === null)) return true
    if (this.options.email.validator) return this.options.email.validator(email)
    if (this.options.email.matcher) return validator.matches(email || '', this.options.email.matcher)
    return validator.isEmail(email || '')
  }

  @Validator('email', { message: 'email-out-of-size' })
  public emailSize(email: string): boolean {
    if (!this.options.email) return true
    if ((this.options.email.optional || this.allOptional) && (email === undefined || email === null)) return true
    if (this.options.email.size) return validator.isLength(email || '', this.options.email.size)
    return true
  }

  @Validator('email', { priority: 1, message: 'email-in-use' })
  public async emailUnique(email: string): Promise<boolean> {
    if (!this.options.email) return true
    if ((this.options.email.optional || this.allOptional) && (email === undefined || email === null)) return true
    return !(await this.authentication.Authenticatable.existsWithCredential('email', email))
  }

  @Validator('firstName', { message: 'invalid-first-name' })
  public firstNameFormat(firstName: string): boolean {
    if (!this.options.firstName) return true
    if ((this.options.firstName.optional || this.allOptional) && (firstName === undefined || firstName === null)) return true
    if (this.options.firstName.validator) return this.options.firstName.validator(firstName)
    if (this.options.firstName.matcher) return validator.matches(firstName || '', this.options.firstName.matcher)
    return true
  }

  @Validator('firstName', { message: 'first-name-out-of-size' })
  public firstNameLength(firstName: string): boolean {
    if (!this.options.firstName) return true
    if ((this.options.firstName.optional || this.allOptional) && (firstName === undefined || firstName === null)) return true
    if (this.options.firstName.size) return validator.isLength(firstName || '', this.options.firstName.size)
    return true
  }

  @Validator('lastName', { message: 'invalid-last-name' })
  public lastNameFormat(lastName: string): boolean {
    if (!this.options.lastName) return true
    if ((this.options.lastName.optional || this.allOptional) && (lastName === undefined || lastName === null)) return true
    if (this.options.lastName.validator) return this.options.lastName.validator(lastName)
    if (this.options.lastName.matcher) return validator.matches(lastName || '', this.options.lastName.matcher)
    return true
  }

  @Validator('lastName', { message: 'last-name-out-of-size' })
  public lastNameLength(lastName: string): boolean {
    if (!this.options.lastName) return true
    if ((this.options.lastName.optional || this.allOptional) && (lastName === undefined || lastName === null)) return true
    if (this.options.lastName.size) return validator.isLength(lastName || '', this.options.lastName.size)
    return true
  }

  @Validator('name', { message: 'invalid-name' })
  public nameFormat(name: string): boolean {
    if (!this.options.name) return true
    if ((this.options.name.optional || this.allOptional) && (name === undefined || name === null)) return true
    if (this.options.name.validator) return this.options.name.validator(name)
    if (this.options.name.matcher) return validator.matches(name || '', this.options.name.matcher)
    return true
  }

  @Validator('name', { message: 'name-out-of-size' })
  public nameLength(name: string): boolean {
    if (!this.options.name) return true
    if ((this.options.name.optional || this.allOptional) && (name === undefined || name === null)) return true
    if (this.options.name.size) return validator.isLength(name || '', this.options.name.size)
    return true
  }

  @Validator('password', { message: 'invalid-password' })
  public passwordFormat(password: string): boolean {
    if (!this.options.password) return true
    if ((this.options.password.optional || this.allOptional) && (password === undefined || password === null)) return true
    if (this.options.password.validator) return this.options.password.validator(password)
    if (this.options.password.matcher) return validator.matches(password || '', this.options.password.matcher)
    return true
  }

  @Validator('password', { message: 'password-out-of-size' })
  public passwordLength(password: string): boolean {
    if (!this.options.password) return true
    if ((this.options.password.optional || this.allOptional) && (password === undefined || password === null)) return true
    if (this.options.password.size) return validator.isLength(password || '', this.options.password.size)
    return true
  }

  @Validator('phone', { message: 'invalid-phone' })
  public phoneFormat(phone: string): boolean {
    if (!this.options.phone) return true
    if ((this.options.phone.optional || this.allOptional) && (phone === undefined || phone === null)) return true
    if (this.options.phone.validator) return this.options.phone.validator(phone)
    if (this.options.phone.matcher) return validator.matches(phone || '', this.options.phone.matcher)
    return validator.isMobilePhone(phone || '')
  }

  @Validator('phone', { message: 'phone-out-of-size' })
  public phoneSize(phone: string): boolean {
    if (!this.options.phone) return true
    if ((this.options.phone.optional || this.allOptional) && (phone === undefined || phone === null)) return true
    if (this.options.phone.size) return validator.isLength(phone || '', this.options.phone.size)
    return true
  }

  @Validator('phone', { priority: 1, message: 'phone-in-use' })
  public async phoneUnique(phone: string): Promise<boolean> {
    if (!this.options.phone) return true
    if ((this.options.phone.optional || this.allOptional) && (phone === undefined || phone === null)) return true
    return !(await this.authentication.Authenticatable.existsWithCredential('phone', phone))
  }

  @Validator('username', { message: 'invalid-username' })
  public usernameFormat(username: string): boolean {
    if (!this.options.username) return true
    if ((this.options.username.optional || this.allOptional) && (username === undefined || username === null)) return true
    if (this.options.username.validator) return this.options.username.validator(username)
    if (this.options.username.matcher) return validator.matches(username || '', this.options.username.matcher)
    return true
  }

  @Validator('username', { message: 'username-out-of-size' })
  public usernameSize(username: string): boolean {
    if (!this.options.username) return true
    if ((this.options.username.optional || this.allOptional) && (username === undefined || username === null)) return true
    if (this.options.username.size) return validator.isLength(username || '', this.options.username.size)
    return true
  }

  @Validator('username', { priority: 1, message: 'username-in-use' })
  public async usernameUnique(username: string): Promise<boolean> {
    if (!this.options.username) return true
    if ((this.options.username.optional || this.allOptional) && (username === undefined || username === null)) return true
    return !(await this.authentication.Authenticatable.existsWithUsername(username))
  }
}

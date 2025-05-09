import Authentication from '../../Authentication'
import { DefaultModuleDynamicNames, DefaultModuleOptions } from '../../types'
import BaseUserValidation from './BaseDefaultModuleValidation'

export default class DefaultModuleValidation extends BaseUserValidation {
  protected readonly authentication: Authentication<DefaultModuleDynamicNames>

  public constructor(initialValues: Record<string, any>, authentication: Authentication<DefaultModuleDynamicNames>, options: DefaultModuleOptions) {
    super(initialValues)
    this.authentication = authentication

    if (options.emailValidation?.matcher) this.emailMatcher = new RegExp(options.emailValidation.matcher)
    if (options.emailValidation?.size) this.emailSize = options.emailValidation.size
    if (options.passwordValidation?.size) this.passwordSize = options.passwordValidation.size
    if (typeof authentication.options.initialDetails?.localeValidation?.optional === 'boolean')
      this.localeOptional = authentication.options.initialDetails.localeValidation.optional
    if (typeof authentication.options.initialDetails?.timezoneValidation?.optional === 'boolean')
      this.timezoneOptional = authentication.options.initialDetails.timezoneValidation.optional
  }

  protected async isEmailTaken(email: string): Promise<boolean> {
    return await this.authentication.performDynamic('user-exists-with-email?', { email })
  }
}

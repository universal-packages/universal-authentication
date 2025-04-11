import Authentication from '../../Authentication'
import { DefaultModuleDynamicNames, DefaultModuleOptions } from '../../types'
import BaseUserValidation from './BaseUserValidation'

export default class UserValidation extends BaseUserValidation {
  protected readonly authentication: Authentication<DefaultModuleDynamicNames>
  protected readonly options: DefaultModuleOptions

  public constructor(authentication: Authentication<DefaultModuleDynamicNames>, options: DefaultModuleOptions) {
    super()
    this.authentication = authentication
    this.options = options
  }
}

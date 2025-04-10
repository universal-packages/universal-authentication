import { DefaultModuleOptions } from '../../types'
import BasePasswordResetValidation from './BasePasswordResetValidation'

export default class PasswordResetValidation extends BasePasswordResetValidation {
  public constructor(options: DefaultModuleOptions) {
    super()
    this.passwordSize = options.passwordValidation?.size ? options.passwordValidation?.size : { min: 8, max: 256 }
  }
}

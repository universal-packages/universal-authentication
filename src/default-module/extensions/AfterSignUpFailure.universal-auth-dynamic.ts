import { AuthDynamic } from '../../decorators'
import { DefaultModuleDynamicNames, EmailPasswordValidationPayload } from '../../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'after-sign-up-failure', true)
export default class AfterSignUpFailureDynamic {
  public async perform(_payload: EmailPasswordValidationPayload): Promise<void> {}
}

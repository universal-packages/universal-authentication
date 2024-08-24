import { AuthDynamic } from '../../decorators'
import { DefaultModuleDynamicNames, EmailPasswordPayload } from '../../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'continue-before-sign-up?', true)
export default class ContinueBeforeSignUpDynamic {
  public async perform(_payload: EmailPasswordPayload): Promise<boolean> {
    return true
  }
}

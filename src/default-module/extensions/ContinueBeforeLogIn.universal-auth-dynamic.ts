import { AuthDynamic } from '../../decorators'
import { DefaultModuleDynamicNames, EmailPasswordPayload } from '../../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'continue-before-log-in?', true)
export default class ContinueBeforeLogInDynamic {
  public async perform(_payload: EmailPasswordPayload): Promise<boolean> {
    return true
  }
}

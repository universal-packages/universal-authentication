import { AuthDynamic } from '../../decorators'
import { DefaultModuleDynamicNames, EmailPasswordPayload } from '../../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'continue-after-user-found?', true)
export default class ContinueAfterUserFoundDynamic {
  public async perform(_payload: EmailPasswordPayload): Promise<boolean> {
    return true
  }
}

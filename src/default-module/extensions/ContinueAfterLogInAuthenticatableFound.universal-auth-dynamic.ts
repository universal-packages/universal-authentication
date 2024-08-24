import { AuthDynamic } from '../../decorators'
import { DefaultModuleDynamicNames, EmailPasswordPayload } from '../../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'continue-after-authenticatable-found?', true)
export default class ContinueAfterAuthenticatableFoundDynamic {
  public async perform(_payload: EmailPasswordPayload): Promise<boolean> {
    return true
  }
}

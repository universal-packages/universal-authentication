import { AuthDynamic } from '../../decorators'
import { DefaultModuleDynamicNames, EmailPasswordPayload } from '../../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'after-log-in-authenticatable-not-found', true)
export default class AfterLogInAuthenticatableNotFoundDynamic {
  public async perform(_payload: EmailPasswordPayload): Promise<void> {}
}

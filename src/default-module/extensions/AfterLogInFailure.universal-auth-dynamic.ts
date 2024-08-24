import { AuthDynamic } from '../../decorators'
import { AuthenticatablePayload, DefaultModuleDynamicNames } from '../../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'after-log-in-failure', true)
export default class AfterLogInFailureDynamic {
  public async perform(_payload: AuthenticatablePayload): Promise<void> {}
}

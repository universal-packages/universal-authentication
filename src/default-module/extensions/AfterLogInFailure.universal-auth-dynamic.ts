import { AuthDynamic } from '../../decorators'
import { DefaultModuleDynamicNames, UserPayload } from '../../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'after-log-in-failure', true)
export default class AfterLogInFailureDynamic {
  public async perform(_payload: UserPayload): Promise<void> {}
}

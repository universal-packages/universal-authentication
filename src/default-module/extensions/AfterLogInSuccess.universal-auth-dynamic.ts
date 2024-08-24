import { AuthDynamic } from '../../decorators'
import { DefaultModuleDynamicNames, EmailPasswordPayload } from '../../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'after-log-in-success', true)
export default class AfterLogInSuccessDynamic {
  public async perform(_payload: EmailPasswordPayload): Promise<void> {}
}

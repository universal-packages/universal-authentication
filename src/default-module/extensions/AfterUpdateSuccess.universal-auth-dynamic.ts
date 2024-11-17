import { AuthDynamic } from '../../decorators'
import { DefaultModuleDynamicNames, UserPayload } from '../../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'after-update-success', true)
export default class AfterUpdateSuccessDynamic {
  public async perform(_payload: UserPayload): Promise<void> {}
}

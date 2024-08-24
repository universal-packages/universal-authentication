import { AuthDynamic } from '../../decorators'
import { AuthenticatablePayload, DefaultModuleDynamicNames } from '../../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'after-update-success', true)
export default class AfterUpdateSuccessDynamic {
  public async perform(_payload: AuthenticatablePayload): Promise<void> {}
}

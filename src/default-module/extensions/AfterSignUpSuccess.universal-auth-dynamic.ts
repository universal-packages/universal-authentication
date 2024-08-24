import { AuthDynamic } from '../../decorators'
import { DefaultModuleDynamicNames, EmailPasswordPayload } from '../../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'after-sign-up-success', true)
export default class AfterSignUpSuccessDynamic {
  public async perform(_payload: EmailPasswordPayload): Promise<void> {}
}

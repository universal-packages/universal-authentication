import { AuthDynamic } from '../../decorators'
import { DefaultModuleDynamicNames, EmailPayload } from '../../types'

@AuthDynamic<DefaultModuleDynamicNames>('default', 'after-log-in-user-not-found', true)
export default class AfterLogInUserNotFoundDynamic {
  public async perform(_payload: EmailPayload): Promise<void> {}
}

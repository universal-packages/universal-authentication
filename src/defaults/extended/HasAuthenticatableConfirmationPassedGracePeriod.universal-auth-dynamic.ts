import ms from 'ms'

import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, HasAuthenticatableConfirmationPassedGracePeriodPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('has-authenticatable-confirmation-passed-grace-period?', true)
export default class HasAuthenticatableConfirmationPassedGracePeriodDynamic {
  public perform(payload: HasAuthenticatableConfirmationPassedGracePeriodPayload, authentication: Authentication): boolean {
    const { authenticatable, credentialKind } = payload
    const credentialKindOptions = authentication.options[credentialKind]

    const graceTimeMs = ms(credentialKindOptions.confirmationGracePeriod)
    const timeAfterCreation = authenticatable.createdAt.getTime() + graceTimeMs

    return timeAfterCreation <= Date.now()
  }
}

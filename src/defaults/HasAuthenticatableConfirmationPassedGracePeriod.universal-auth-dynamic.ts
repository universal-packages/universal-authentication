import ms from 'ms'
import { AuthDynamicNames, AuthDynamicPayload, CredentialKindAuthenticatablePayload } from '../Authentication.types'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('has-authenticatable-confirmation-passed-grace-period?', true)
export default class HasAuthenticatableConfirmationPassedGracePeriodDynamic {
  public perform(payload: AuthDynamicPayload<CredentialKindAuthenticatablePayload>): boolean {
    const { authenticatable, credentialKind } = payload.body

    const graceTimeMs = ms(payload.authOptions[credentialKind].confirmationGracePeriod)
    const timeAfterCreation = authenticatable.createdAt.getTime() + graceTimeMs

    return timeAfterCreation <= new Date().getTime()
  }
}

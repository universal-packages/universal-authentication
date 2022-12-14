import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, VerifyUnlockPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('verify-unlock', true)
export default class VerifyUnlockDynamic {
  public async perform(payload: VerifyUnlockPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { credential, credentialKind, oneTimePassword } = payload

    if (authentication.performDynamicSync('verify-one-time-password', { concern: 'unlock', credential, credentialKind, oneTimePassword })) {
      const authenticatable = await authentication.performDynamic('authenticatable-from-credential', { credential })

      authentication.performDynamicSync('set-authenticatable-unlocked', { authenticatable })
      await authentication.performDynamic('save-authenticatable', { authenticatable })

      return { status: 'success', authenticatable }
    }

    return { status: 'failure', message: 'invalid-one-time-password' }
  }
}

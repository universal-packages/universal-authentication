import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, VerifyCorroborationPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('verify-confirmation', true)
export default class VerifyConfirmationDynamic {
  public async perform(payload: VerifyCorroborationPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { credential, credentialKind, oneTimePassword } = payload

    if (authentication.performDynamicSync('verify-one-time-password', { concern: 'confirmation', identifier: `${credential}.${credentialKind}`, oneTimePassword })) {
      const authenticatable = await authentication.performDynamic('authenticatable-from-credential', { credential })

      authentication.performDynamicSync('set-authenticatable-confirmed', { authenticatable, credentialKind })
      await authentication.performDynamic('save-authenticatable', { authenticatable })

      return { status: 'success', authenticatable }
    }

    return { status: 'failure', message: 'invalid-one-time-password' }
  }
}

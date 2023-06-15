import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, AuthenticationResult, VerifyCorroborationPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('verify-confirmation', true)
export default class VerifyConfirmationDynamic {
  public async perform(payload: VerifyCorroborationPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { credential, credentialKind, oneTimePassword } = payload
    const authenticatable = await authentication.performDynamic('authenticatable-from-credential', { credential })
    const credentialToVerify = authenticatable[`unconfirmed${credentialKind.charAt(0).toUpperCase()}${credentialKind.slice(1)}`] || authenticatable[credentialKind]

    if (authentication.performDynamicSync('verify-one-time-password', { concern: 'confirmation', identifier: `${credentialToVerify}.${credentialKind}`, oneTimePassword })) {
      authentication.performDynamicSync('stablish-authenticatable-unconfirmed-credential', { authenticatable, credentialKind })
      authentication.performDynamicSync('set-authenticatable-confirmed', { authenticatable, credentialKind })

      try {
        await authentication.performDynamic('save-authenticatable', { authenticatable })
      } catch {
        return { status: 'failure', message: 'confirmation-impossible' }
      }

      await authentication.performDynamic('send-confirmation-thanks', { authenticatable, credentialKind })

      return { status: 'success', authenticatable }
    }

    return { status: 'failure', message: 'invalid-one-time-password' }
  }
}

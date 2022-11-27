import Authentication from '../../Authentication'
import { AuthDynamicNames, AuthenticationResult, VerifyPasswordResetPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('verify-password-reset', true)
export default class VerifyPasswordResetDynamic {
  public async perform(payload: VerifyPasswordResetPayload, authentication: Authentication): Promise<AuthenticationResult> {
    const { credential, credentialKind, oneTimePassword, password } = payload

    if (authentication.performDynamicSync('verify-one-time-password', { concern: 'password-reset', credential, credentialKind, oneTimePassword })) {
      const authenticatable = await authentication.performDynamic('authenticatable-from-credential', { credential })

      const validation = await authentication.performDynamic('validate-attributes', { attributes: { password }, include: ['password'] })

      if (validation.valid) {
        authentication.performDynamicSync('set-authenticatable-attributes', { authenticatable, attributes: { password }, include: ['password'] })
        await authentication.performDynamic('save-authenticatable', { authenticatable })

        return { status: 'success', authenticatable }
      } else {
        return { status: 'failure', validation }
      }
    }

    return { status: 'failure', message: 'invalid-one-time-password' }
  }
}

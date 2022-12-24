import { encryptSubject } from '@universal-packages/crypto-utils'
import Authentication from '../../Authentication'
import { AuthDynamicNames, EncryptInvitationPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('encrypt-invitation', true)
export default class EncryptInvitationPayloadDynamic {
  public perform(payload: EncryptInvitationPayload, authentication: Authentication): string {
    const { credential, credentialKind, invitation } = payload

    const secret = authentication.performDynamicSync('generate-concern-secret', { concern: 'invitation', credential, credentialKind })

    return encryptSubject(invitation, secret, { concern: 'invitation' })
  }
}

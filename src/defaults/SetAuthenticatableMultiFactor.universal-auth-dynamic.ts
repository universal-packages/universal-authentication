import { generate } from '@universal-packages/time-based-one-time-password'
import { AuthDynamicNames, AuthDynamicPayload, AuthenticatablePayload } from '../Authentication.types'
import { hashSubject } from '../crypto'
import { AuthDynamic } from '../decorators'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-multi-factor', true)
export default class SetAuthenticatableMultiFactorDynamic {
  public perform(payload: AuthDynamicPayload<AuthenticatablePayload>): void {
    const { authenticatable } = payload.body
    const secret = hashSubject(`${payload.authOptions.secret}.multi-factor.${authenticatable.id}`)
    const oneTimePassword = generate(secret)

    authenticatable.multiFactorCurrentOneTimePassword = oneTimePassword
    authenticatable.multiFactorCurrentOneTimePasswordSetAt = new Date()
  }
}

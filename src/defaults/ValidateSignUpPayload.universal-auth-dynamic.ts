import { AuthDynamicNames, AuthDynamicPayload, SignUpPayload, ValidationResult } from '../Authentication.types'
import { AuthDynamic } from '../decorators'
import SignUpPayloadValidation from '../validations/SignUpPayloadValidation'

@AuthDynamic<AuthDynamicNames>('validate-sign-up-payload', true)
export default class ValidateSignUpPayloadDynamic {
  public async perform(payload: AuthDynamicPayload<SignUpPayload>): Promise<ValidationResult> {
    const { credentialKind } = payload.body

    return await new SignUpPayloadValidation(payload.Authenticatable, payload.authOptions[credentialKind].signUpValidations).validate(payload.body)
  }
}

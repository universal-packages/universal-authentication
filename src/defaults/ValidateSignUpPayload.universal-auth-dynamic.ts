import { AuthDynamicPayload, SignUpPayload, ValidationResult } from '../Authentication.types'
import { AuthDynamic } from '../decorators'
import SignUpBodyValidation from '../validations/SignUpBodyValidation'

@AuthDynamic('validate-sign-up-payload', true)
export default class ValidateSignUpPayloadDynamic {
  public async perform(payload: AuthDynamicPayload<SignUpPayload>): Promise<ValidationResult> {
    return await new SignUpBodyValidation(payload.Authenticatable, payload.authOptions).validate(payload.body)
  }
}

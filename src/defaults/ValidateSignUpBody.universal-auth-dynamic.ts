import { AuthDynamicPayload, SignUpBody, ValidationResult } from '../Authentication.types'
import { AuthDynamic } from '../decorators'
import SignUpBodyValidation from '../validations/SignUpBodyValidation'

@AuthDynamic('validate-sign-up-body', true)
export default class ValidateSignUpBodyDynamic {
  public async perform(payload: AuthDynamicPayload<SignUpBody>): Promise<ValidationResult> {
    return await new SignUpBodyValidation(payload.Authenticatable, payload.authOptions).validate(payload.body)
  }
}

import Authentication from './Authentication'
import { AuthDynamic } from './decorators'
import { AuthDynamicNames, ValidateInitialDetailsPayload, ValidationResult } from './types'
import InitialDetailsValidation from './validations/InitialDetailsValidation'

@AuthDynamic<AuthDynamicNames>('validate-initial-details', true)
export default class ValidateInitialDetailsDynamic {
  public async perform(payload: ValidateInitialDetailsPayload, authentication: Authentication): Promise<ValidationResult> {
    const validationInstance = new InitialDetailsValidation()

    if (typeof authentication.options.initialDetails?.localeValidation?.optional === 'boolean')
      validationInstance.localeOptional = authentication.options.initialDetails.localeValidation.optional
    if (typeof authentication.options.initialDetails?.timezoneValidation?.optional === 'boolean')
      validationInstance.timezoneOptional = authentication.options.initialDetails.timezoneValidation.optional

    return await validationInstance.validate(payload, 'initial-details')
  }
}

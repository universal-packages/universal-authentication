import { ValidationResult } from '@universal-packages/validations'

import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AttributesValidationOptions, AuthDynamicNames, ValidateAttributesPayload } from '../../types'
import AttributesValidation from '../../validations/AttributesValidation'

@AuthDynamic<AuthDynamicNames>('validate-attributes', true)
export default class ValidateAttributesDynamic {
  public async perform(payload: ValidateAttributesPayload, authentication: Authentication): Promise<ValidationResult> {
    const { attributes, include, exclude, allOptional } = payload
    const attributeKeys: (keyof AttributesValidationOptions)[] = ['email', 'username', 'phone', 'password', 'firstName', 'lastName', 'name']
    const finalOptions = { ...authentication.options.validations }

    if (include) {
      for (let i = 0; i < attributeKeys.length; i++) {
        if (!include.includes(attributeKeys[i])) {
          delete finalOptions[attributeKeys[i]]
        }
      }
    } else if (exclude) {
      for (let i = 0; i < attributeKeys.length; i++) {
        if (exclude.includes(attributeKeys[i])) {
          delete finalOptions[attributeKeys[i]]
        }
      }
    }

    return await new AttributesValidation(authentication, finalOptions, allOptional).validate(attributes)
  }
}

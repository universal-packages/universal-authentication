import { AssignableAttributes, AuthDynamicNames, SetAuthenticatableAttributesPayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-attributes', true)
export default class SetAuthenticatableAttributesDynamic {
  public perform(payload: SetAuthenticatableAttributesPayload): void {
    const { authenticatable, attributes, include, exclude } = payload
    const attributeKeys: (keyof AssignableAttributes)[] = ['email', 'username', 'phone', 'password', 'firstName', 'lastName', 'name']

    if (include) {
      for (let i = 0; i < include.length; i++) {
        authenticatable[include[i]] = attributes[include[i]]
      }
    } else if (exclude) {
      const filtered = attributeKeys.filter((key: keyof AssignableAttributes): boolean => exclude.includes(key))

      for (let i = 0; i < filtered.length; i++) {
        authenticatable[filtered[i]] = attributes[filtered[i]]
      }
    } else {
      for (let i = 0; i < attributeKeys.length; i++) {
        authenticatable[attributeKeys[i]] = attributes[attributeKeys[i]]
      }
    }
  }
}

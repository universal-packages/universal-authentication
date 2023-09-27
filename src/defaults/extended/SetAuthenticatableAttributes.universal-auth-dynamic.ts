import Authentication from '../../Authentication'
import { AuthDynamic } from '../../decorators'
import { AssignableAttributes, AuthDynamicNames, SetAuthenticatableAttributesPayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-attributes', true)
export default class SetAuthenticatableAttributesDynamic {
  public perform(payload: SetAuthenticatableAttributesPayload, authentication: Authentication): void {
    const { authenticatable, attributes, include, exclude } = payload
    const attributeKeys: (keyof AssignableAttributes)[] = ['email', 'username', 'phone', 'password', 'firstName', 'lastName', 'name', 'profilePictureUrl', 'multiFactorEnabled']
    let finalToUse: (keyof AssignableAttributes)[] = []

    if (include) {
      finalToUse = include
    } else if (exclude) {
      finalToUse = attributeKeys.filter((key: keyof AssignableAttributes): boolean => !exclude.includes(key))
    } else {
      finalToUse = attributeKeys
    }

    if (finalToUse.includes('email') && attributes.email !== undefined) authenticatable.email = attributes.email.toLowerCase()
    if (finalToUse.includes('username') && attributes.username !== undefined) authenticatable.username = attributes.username
    if (finalToUse.includes('firstName') && attributes.firstName !== undefined) authenticatable.firstName = attributes.firstName
    if (finalToUse.includes('lastName') && attributes.lastName !== undefined) authenticatable.lastName = attributes.lastName
    if (finalToUse.includes('name') && attributes.name !== undefined) authenticatable.name = attributes.name
    if (finalToUse.includes('phone') && attributes.phone !== undefined) authenticatable.phone = attributes.phone
    if (finalToUse.includes('password') && attributes.password !== undefined)
      authentication.performDynamicSync('set-authenticatable-password', { authenticatable, password: attributes.password })
    if (finalToUse.includes('profilePictureUrl') && attributes.profilePictureUrl !== undefined)
      authentication.performDynamicSync('set-authenticatable-profile-picture', { authenticatable, pictureUrl: attributes.profilePictureUrl })
    if (finalToUse.includes('multiFactorEnabled') && attributes.phone !== undefined) authenticatable.multiFactorEnabled = !!attributes.multiFactorEnabled
  }
}

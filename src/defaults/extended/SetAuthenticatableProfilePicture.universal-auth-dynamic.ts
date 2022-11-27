import { AuthDynamicNames, SetAuthenticatableProfilePicturePayload } from '../../Authentication.types'
import { AuthDynamic } from '../../decorators'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-profile-picture', true)
export default class SetAuthenticatableProfilePictureDynamic {
  public perform(payload: SetAuthenticatableProfilePicturePayload): void {
    const { authenticatable, pictureUrl } = payload

    authenticatable.profilePictureUrl = pictureUrl
  }
}

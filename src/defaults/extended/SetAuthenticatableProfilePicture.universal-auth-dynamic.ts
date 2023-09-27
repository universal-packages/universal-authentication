import { AuthDynamic } from '../../decorators'
import { AuthDynamicNames, SetAuthenticatableProfilePicturePayload } from '../../types'

@AuthDynamic<AuthDynamicNames>('set-authenticatable-profile-picture', true)
export default class SetAuthenticatableProfilePictureDynamic {
  public perform(payload: SetAuthenticatableProfilePicturePayload): void {
    const { authenticatable, pictureUrl } = payload

    authenticatable.profilePictureUrl = pictureUrl
  }
}

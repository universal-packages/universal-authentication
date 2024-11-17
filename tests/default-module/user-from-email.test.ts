import { Authentication, DefaultModuleDynamicNames } from '../../src'
import UserFromEmailDynamic from '../../src/default-module/UserFromEmail.universal-auth-dynamic'

describe(Authentication, (): void => {
  describe(UserFromEmailDynamic, (): void => {
    it('needs to be overridden', async (): Promise<void> => {
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      const lister = jest.fn()
      authentication.on('warning', lister)

      const result = await authentication.performDynamic('user-from-email', { email: 'email@david.com' })

      expect(result).toBeNull()
      expect(lister).toHaveBeenCalledWith({
        event: 'warning',
        message: 'Not implemented',
        payload: {
          dynamic: 'UserFromEmailDynamic',
          with: {
            email: 'email@david.com'
          }
        }
      })
    })
  })
})

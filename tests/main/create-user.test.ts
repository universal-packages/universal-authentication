import { Authentication, DefaultModuleDynamicNames } from '../../src'
import CreateUserDynamic from '../../src/CreateUser.universal-auth-dynamic'

describe(Authentication, (): void => {
  describe(CreateUserDynamic, (): void => {
    it('needs to be overridden', async (): Promise<void> => {
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      const lister = jest.fn()
      authentication.on('warning', lister)

      const result = await authentication.performDynamic('create-user', { attributes: { email: 'david@universal-packages.com', encryptedPassword: 'password' } })

      expect(result).toBeNull()
      expect(lister).toHaveBeenCalledWith({
        event: 'warning',
        message: 'Not implemented',
        payload: {
          dynamic: 'CreateUserDynamic',
          with: {
            attributes: {
              email: 'david@universal-packages.com',
              encryptedPassword: 'password'
            }
          }
        }
      })
    })
  })
})

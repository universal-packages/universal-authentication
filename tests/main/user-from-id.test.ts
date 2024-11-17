import { Authentication } from '../../src'
import UserFromIdDynamic from '../../src/UserFromId.universal-auth-dynamic'

describe(Authentication, (): void => {
  describe(UserFromIdDynamic, (): void => {
    it('needs to be overridden', async (): Promise<void> => {
      const authentication = new Authentication({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      const lister = jest.fn()
      authentication.on('warning', lister)

      const result = await authentication.performDynamic('user-from-id', { id: 99 })

      expect(result).toBeNull()
      expect(lister).toHaveBeenCalledWith({
        event: 'warning',
        message: 'Not implemented',
        payload: {
          dynamic: 'UserFromIdDynamic',
          with: {
            id: 99
          }
        }
      })
    })
  })
})

import { Authentication } from '../../src'
import UpdateUserDynamic from '../../src/UpdateUser.universal-auth-dynamic'

describe(Authentication, (): void => {
  describe(UpdateUserDynamic, (): void => {
    it('needs to be overridden', async (): Promise<void> => {
      const authentication = new Authentication({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      const lister = jest.fn()
      authentication.on('warning', lister)

      const result = await authentication.performDynamic('update-user', { user: { id: 99 }, attributes: { name: 'John' } })

      expect(result).toBeNull()
      expect(lister).toHaveBeenCalledWith({
        event: 'warning',
        message: 'Not implemented',
        payload: {
          dynamic: 'UpdateUserDynamic',
          with: {
            user: { id: 99 },
            attributes: { name: 'John' }
          }
        }
      })
    })
  })
})

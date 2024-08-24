import { Authentication } from '../../src'
import AuthenticatableFromIdDynamic from '../../src/AuthenticatableFromId.universal-auth-dynamic'
import VerifyOneTimePasswordDynamic from '../../src/VerifyOneTimePassword.universal-auth-dynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe(Authentication, (): void => {
  describe(AuthenticatableFromIdDynamic, (): void => {
    it('gets an authenticatable by id', async (): Promise<void> => {
      const authentication = new Authentication({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      authentication.setAuthenticatableClass(TestAuthenticatable)
      await authentication.loadDynamics()

      dynamicApiJest.mockDynamicReturnValue(VerifyOneTimePasswordDynamic, true)

      const result = await authentication.performDynamic('authenticatable-from-id', { id: 99 })

      expect(result).toEqual(TestAuthenticatable.lastInstance)
      expect(TestAuthenticatable.lastInstance.id).toEqual(99)
    })
  })
})

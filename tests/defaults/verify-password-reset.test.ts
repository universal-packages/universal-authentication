import { Authentication, CredentialKind } from '../../src'
import SaveAuthenticatableDynamic from '../../src/defaults/extended/SaveAuthenticatable.universal-auth-dynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

beforeEach((): void => {
  TestAuthenticatable.lastInstance = undefined
})

describe(Authentication, (): void => {
  describe('verify-password-reset', (): void => {
    describe('when the one time password is valid', (): void => {
      it('returns success', async (): Promise<void> => {
        const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'password-reset', identifier: 'any' })

        const result = await authentication.performDynamic('verify-password-reset', { credential: 'any', oneTimePassword, password: 'new-password' })

        expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
        expect(TestAuthenticatable.lastInstance.password).toEqual('new-password')
        expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
      })

      describe('but the new password is not valid', (): void => {
        it('returns failure and validation', async (): Promise<void> => {
          const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
          authentication.options['namespace'] = 'universal-auth'
          await authentication.loadDynamics()

          const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'password-reset', identifier: 'any' })

          const result = await authentication.performDynamic('verify-password-reset', { credential: 'any', oneTimePassword, password: 'short' })

          expect(result).toEqual({ status: 'failure', validation: { valid: false, errors: { password: ['password-out-of-size'] } } })
          expect(TestAuthenticatable.lastInstance.password).not.toEqual('new-password')
          expect(SaveAuthenticatableDynamic).not.toHaveBeenPerformed()
        })
      })
    })

    describe('when credential is not form a valid authenticatable', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const oneTimePassword = authentication.performDynamicSync('generate-one-time-password', { concern: 'password-reset', identifier: 'any.nothing' })

        const result = await authentication.performDynamic('verify-password-reset', { credential: 'any.nothing', oneTimePassword, password: 'new' })

        expect(result).toEqual({ status: 'failure', message: 'nothing-to-do' })
        expect(SaveAuthenticatableDynamic).not.toHaveBeenPerformed()
      })
    })

    describe('when the one time password is not valid', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const result = await authentication.performDynamic('verify-password-reset', { credential: 'any', oneTimePassword: 'nop', password: 'new' })

        expect(result).toEqual({ status: 'failure', message: 'invalid-one-time-password' })
        expect(SaveAuthenticatableDynamic).not.toHaveBeenPerformed()
      })
    })
  })
})

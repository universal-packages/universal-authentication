import { Authentication, DefaultModuleDynamicNames } from '../../src'
import UpdateUserDynamic from '../../src/UpdateUser.universal-auth-dynamic'
import UpdateEmailPasswordDynamic from '../../src/default-module/UpdateEmailPassword.universal-auth-dynamic'
import AfterUpdateSuccessDynamic from '../../src/default-module/extensions/AfterUpdateSuccess.universal-auth-dynamic'

describe(Authentication, (): void => {
  describe(UpdateEmailPasswordDynamic, (): void => {
    describe('when the right update attributes are passed', (): void => {
      it('returns success', async (): Promise<void> => {
        const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const user = { email: 'david@universal-packages.com' }

        const result = await authentication.performDynamic('update-email-password', { user, email: 'another@universal-packages.com', password: 'new-password' })

        expect(result).toEqual({ status: 'success', user })
        expect(UpdateUserDynamic).toHaveBeenPerformedWith({ user, attributes: { email: 'another@universal-packages.com', encryptedPassword: expect.any(String) } })
        expect(AfterUpdateSuccessDynamic).toHaveBeenPerformedWith({ user })
      })
    })

    describe('when only email is passed', (): void => {
      it('returns success and only updates the email', async (): Promise<void> => {
        const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const user = { email: 'david@universal-packages.com', password: 'password' }

        const result = await authentication.performDynamic('update-email-password', { user, email: 'another@universal-packages.com' })

        expect(result).toEqual({ status: 'success', user })
        expect(UpdateUserDynamic).toHaveBeenPerformedWith({ user, attributes: { email: 'another@universal-packages.com' } })
        expect(AfterUpdateSuccessDynamic).toHaveBeenPerformedWith({ user })
      })
    })

    describe('when only password is passed', (): void => {
      it('returns success and only updates the password', async (): Promise<void> => {
        const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const user = { email: 'david@universal-packages.com', password: 'password' }

        const result = await authentication.performDynamic('update-email-password', { user, password: 'new-password' })

        expect(result).toEqual({ status: 'success', user })
        expect(UpdateUserDynamic).toHaveBeenPerformedWith({ user, attributes: { encryptedPassword: expect.any(String) } })
        expect(AfterUpdateSuccessDynamic).toHaveBeenPerformedWith({ user })
      })
    })

    describe('when invalid attributes are passed', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const user = { email: 'david@universal-packages.com', password: 'password' }

        const result = await authentication.performDynamic('update-email-password', { user, email: 'bad', password: 'short' })

        expect(result).toEqual({ status: 'failure', validation: { valid: false, errors: { email: ['invalid-email'], password: ['password-out-of-size'] } } })
      })
    })
  })
})

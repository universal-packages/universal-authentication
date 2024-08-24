import { Authentication } from '../../src'
import SaveAuthenticatableDynamic from '../../src/SaveAuthenticatable.universal-auth-dynamic'
import SetAuthenticatableUpdateAttributesDynamic from '../../src/default-module/SetAuthenticatableUpdateAttributes.universal-auth-dynamic'
import UpdateEmailPasswordDynamic from '../../src/default-module/UpdateEmailPassword.universal-auth-dynamic'
import AfterUpdateSuccessDynamic from '../../src/default-module/extensions/AfterUpdateSuccess.universal-auth-dynamic'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe(Authentication, (): void => {
  describe(UpdateEmailPasswordDynamic, (): void => {
    describe('when the right signup attributes are passed', (): void => {
      it('returns success', async (): Promise<void> => {
        const authentication = new Authentication({ dynamicsLocation: './src', secret: '123' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const authenticatable = TestAuthenticatable.fromId(10)
        const lastEncryptedPassword = authenticatable.encryptedPassword

        const result = await authentication.performDynamic('update-email-password', { authenticatable, email: 'another@universal-packages.com', password: 'new-password' })

        expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
        expect(TestAuthenticatable.lastInstance).toMatchObject({
          email: 'another@universal-packages.com',
          encryptedPassword: expect.not.stringMatching(lastEncryptedPassword)
        })
        expect(SetAuthenticatableUpdateAttributesDynamic).toHaveBeenPerformedWith({
          authenticatable: TestAuthenticatable.lastInstance,
          email: 'another@universal-packages.com',
          password: 'new-password'
        })
        expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
        expect(AfterUpdateSuccessDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
      })
    })

    describe('when only email is passed', (): void => {
      it('returns success and only updates the email', async (): Promise<void> => {
        const authentication = new Authentication({ dynamicsLocation: './src', secret: '123' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const authenticatable = TestAuthenticatable.fromId(10)
        const lastEncryptedPassword = authenticatable.encryptedPassword

        const result = await authentication.performDynamic('update-email-password', { authenticatable, email: 'another@universal-packages.com' })

        expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
        expect(TestAuthenticatable.lastInstance).toMatchObject({
          email: 'another@universal-packages.com',
          encryptedPassword: lastEncryptedPassword
        })
        expect(SetAuthenticatableUpdateAttributesDynamic).toHaveBeenPerformedWith({
          authenticatable: TestAuthenticatable.lastInstance,
          email: 'another@universal-packages.com'
        })
        expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
        expect(AfterUpdateSuccessDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
      })
    })

    describe('when only password is passed', (): void => {
      it('returns success and only updates the password', async (): Promise<void> => {
        const authentication = new Authentication({ dynamicsLocation: './src', secret: '123' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const authenticatable = TestAuthenticatable.fromId(10)
        const lastEmail = authenticatable.email
        const lastEncryptedPassword = authenticatable.encryptedPassword

        const result = await authentication.performDynamic('update-email-password', { authenticatable, password: 'new-password' })

        expect(result).toEqual({ status: 'success', authenticatable: expect.any(TestAuthenticatable) })
        expect(TestAuthenticatable.lastInstance).toMatchObject({
          email: lastEmail,
          encryptedPassword: expect.not.stringMatching(lastEncryptedPassword)
        })
        expect(SetAuthenticatableUpdateAttributesDynamic).toHaveBeenPerformedWith({
          authenticatable: TestAuthenticatable.lastInstance,
          password: 'new-password'
        })
        expect(SaveAuthenticatableDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
        expect(AfterUpdateSuccessDynamic).toHaveBeenPerformedWith({ authenticatable: TestAuthenticatable.lastInstance })
      })
    })

    describe('when invalid attributes are passed', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication({ dynamicsLocation: './src', secret: '123' }, TestAuthenticatable)
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const authenticatable = TestAuthenticatable.fromId(10)

        const result = await authentication.performDynamic('update-email-password', { authenticatable, email: 'bad', password: 'short' })

        expect(result).toEqual({ status: 'failure', validation: { valid: false, errors: { email: ['invalid-email'], password: ['password-out-of-size'] } } })
      })
    })
  })
})

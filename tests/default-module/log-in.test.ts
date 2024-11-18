import { hashSubject } from '@universal-packages/crypto-utils'

import { Authentication, DefaultModuleDynamicNames } from '../../src'
import LogInDynamic from '../../src/default-module/LogIn.universal-auth-dynamic'
import UserFromEmailDynamic from '../../src/default-module/UserFromEmail.universal-auth-dynamic'
import AfterLogInFailureDynamic from '../../src/default-module/extensions/AfterLogInFailure.universal-auth-dynamic'
import AfterLogInSuccessDynamic from '../../src/default-module/extensions/AfterLogInSuccess.universal-auth-dynamic'
import AfterLogInUserNotFoundDynamic from '../../src/default-module/extensions/AfterLogInUserNotFound.universal-auth-dynamic'
import ContinueAfterUserFoundDynamic from '../../src/default-module/extensions/ContinueAfterLogInUserFound.universal-auth-dynamic'
import ContinueBeforeLogInDynamic from '../../src/default-module/extensions/ContinueBeforeLogIn.universal-auth-dynamic'

describe(Authentication, (): void => {
  describe(LogInDynamic, (): void => {
    describe('when the right email and password are provided', (): void => {
      it('returns success', async (): Promise<void> => {
        const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const user = { id: 1, email: 'david@universal-packages.com', encryptedPassword: hashSubject('password') }
        dynamicApiJest.mockDynamicReturnValue(UserFromEmailDynamic, user)

        const result = await authentication.performDynamic('log-in', { email: 'david@universal-packages.com', password: 'password' })

        expect(result).toEqual({ status: 'success', user })
        expect(ContinueBeforeLogInDynamic).toHaveBeenPerformedWith({ email: 'david@universal-packages.com', password: 'password' })
        expect(ContinueAfterUserFoundDynamic).toHaveBeenPerformedWith({ user })
        expect(AfterLogInSuccessDynamic).toHaveBeenPerformedWith({ user })
      })
    })

    describe('when no user can be found by the email', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        dynamicApiJest.mockDynamicReturnValue(UserFromEmailDynamic, undefined)

        const result = await authentication.performDynamic('log-in', { email: 'invalid@universal-packages.com', password: 'password' })

        expect(result).toEqual({ status: 'failure', message: 'invalid-credentials' })
        expect(ContinueBeforeLogInDynamic).toHaveBeenPerformedWith({ email: 'invalid@universal-packages.com', password: 'password' })
        expect(AfterLogInUserNotFoundDynamic).toHaveBeenPerformedWith({ email: 'invalid@universal-packages.com' })
      })
    })

    describe('when the password do not match', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const user = { id: 1, email: 'david@universal-packages.com', encryptedPassword: hashSubject('password') }
        dynamicApiJest.mockDynamicReturnValue(UserFromEmailDynamic, user)

        const result = await authentication.performDynamic('log-in', { email: 'david@universal-packages.com', password: 'incorrect' })

        expect(result).toEqual({ status: 'failure', message: 'invalid-credentials' })
        expect(ContinueBeforeLogInDynamic).toHaveBeenPerformedWith({ email: 'david@universal-packages.com', password: 'incorrect' })
        expect(ContinueAfterUserFoundDynamic).toHaveBeenPerformedWith({ user })
        expect(AfterLogInFailureDynamic).toHaveBeenPerformedWith({ user })
      })
    })

    describe('when log in should not continue', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        dynamicApiJest.mockDynamicReturnValue(ContinueBeforeLogInDynamic, false)

        const result = await authentication.performDynamic('log-in', { email: 'david@universal-packages.com', password: 'password' })

        expect(result).toEqual({ status: 'failure', message: 'log-in-not-allowed' })
        expect(ContinueBeforeLogInDynamic).toHaveBeenPerformedWith({ email: 'david@universal-packages.com', password: 'password' })
      })
    })

    describe('when log in should not continue after user found', (): void => {
      it('returns failure', async (): Promise<void> => {
        const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
        authentication.options['namespace'] = 'universal-auth'
        await authentication.loadDynamics()

        const user = { id: 1, email: 'david@universal-packages.com', encryptedPassword: hashSubject('password') }
        dynamicApiJest.mockDynamicReturnValue(UserFromEmailDynamic, user)

        dynamicApiJest.mockDynamicReturnValue(ContinueAfterUserFoundDynamic, false)

        const result = await authentication.performDynamic('log-in', { email: 'david@universal-packages.com', password: 'password' })

        expect(result).toEqual({ status: 'failure', message: 'log-in-not-allowed' })
        expect(ContinueBeforeLogInDynamic).toHaveBeenPerformedWith({ email: 'david@universal-packages.com', password: 'password' })
        expect(ContinueAfterUserFoundDynamic).toHaveBeenPerformedWith({ user })
      })
    })
  })
})

import { Authentication, DefaultModuleDynamicNames } from '../../../src'
import UserExistsWithEmailDynamic from '../../../src/default-module/UserExistsWithEmail.universal-auth-dynamic'
import UpdateValidation from '../../../src/default-module/validations/UpdateValidation'

describe(UpdateValidation, (): void => {
  it('ignore empty entries', async (): Promise<void> => {
    const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
    const validation = new UpdateValidation(authentication, 'email@email.com', {})

    const result = await validation.validate({})

    expect(result).toEqual({
      errors: {},
      valid: true
    })
  })

  it('validates invalid email', async (): Promise<void> => {
    const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
    const validation = new UpdateValidation(authentication, 'email@email.com', {})
    const result = await validation.validate({ email: 'david', password: 'password' })

    expect(result).toEqual({
      errors: {
        email: ['invalid-email']
      },
      valid: false
    })
  })

  it('validates if the email is already in use', async (): Promise<void> => {
    const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
    authentication.options['namespace'] = 'universal-auth'
    await authentication.loadDynamics()

    dynamicApiJest.mockDynamicReturnValue(UserExistsWithEmailDynamic, true)

    const validation = new UpdateValidation(authentication, 'email@email.com', {})
    const result = await validation.validate({ email: 'exists@email.com', password: 'password' })

    expect(result).toEqual({
      errors: {
        email: ['email-in-use']
      },
      valid: false
    })
  })

  it('ignores if the email is the same as the user email', async (): Promise<void> => {
    const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
    authentication.options['namespace'] = 'universal-auth'
    await authentication.loadDynamics()

    const validation = new UpdateValidation(authentication, 'exists@email.com', {})
    const result = await validation.validate({ email: 'exists@email.com', password: 'password' })

    expect(result).toEqual({
      errors: {},
      valid: true
    })
  })

  it('can use a custom email matcher', async (): Promise<void> => {
    const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
    const validation = new UpdateValidation(authentication, 'email@email.com', { emailValidation: { matcher: /@universal-packages.com$/ } })

    const result = await validation.validate({ email: 'david@nottheone.com', password: 'password' })

    expect(result).toEqual({
      errors: {
        email: ['invalid-email']
      },
      valid: false
    })
  })

  it('can validate custom email and password sizes', async (): Promise<void> => {
    const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
    const validation = new UpdateValidation(authentication, 'email@email.com', { emailValidation: { size: { min: 10 } }, passwordValidation: { size: { min: 10 } } })

    const result = await validation.validate({ email: 'a@my.com', password: 'short' })

    expect(result).toEqual({
      errors: {
        email: ['email-out-of-size'],
        password: ['password-out-of-size']
      },
      valid: false
    })
  })
})

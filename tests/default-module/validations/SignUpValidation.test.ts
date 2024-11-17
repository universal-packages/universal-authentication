import { Authentication, DefaultModuleDynamicNames } from '../../../src'
import UserExistsWithEmailDynamic from '../../../src/default-module/UserExistsWithEmail.universal-auth-dynamic'
import SignUpValidation from '../../../src/default-module/validations/SignUpValidation'

describe(SignUpValidation, (): void => {
  it('validates empty entries', async (): Promise<void> => {
    const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
    const validation = new SignUpValidation(authentication, {})

    const result = await validation.validate({})

    expect(result).toEqual({
      errors: {
        email: ['empty-email'],
        password: ['empty-password']
      },
      valid: false
    })
  })

  it('validates invalid email', async (): Promise<void> => {
    const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
    const validation = new SignUpValidation(authentication, {})
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

    const validation = new SignUpValidation(authentication, {})
    const result = await validation.validate({ email: 'exists@email.com', password: 'password' })

    expect(result).toEqual({
      errors: {
        email: ['email-in-use']
      },
      valid: false
    })
  })

  it('can use a custom email matcher', async (): Promise<void> => {
    const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
    const validation = new SignUpValidation(authentication, { emailValidation: { matcher: /@universal-packages.com$/ } })

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
    const validation = new SignUpValidation(authentication, { emailValidation: { size: { min: 10 } }, passwordValidation: { size: { min: 10 } } })

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

import PasswordResetValidation from '../../../src/default-module/validations/PasswordResetValidation'
import TestAuthenticatable from '../../__fixtures__/TestAuthenticatable'

describe(PasswordResetValidation, (): void => {
  it('validates empty entries', async (): Promise<void> => {
    const validation = new PasswordResetValidation({})

    const result = await validation.validate({})

    expect(result).toEqual({
      errors: {
        password: ['empty-password']
      },
      valid: false
    })
  })

  it('can validate custom email and password sizes', async (): Promise<void> => {
    const validation = new PasswordResetValidation({ passwordValidation: { size: { min: 10 } } })

    const result = await validation.validate({ password: 'short' })

    expect(result).toEqual({
      errors: {
        password: ['password-out-of-size']
      },
      valid: false
    })
  })
})

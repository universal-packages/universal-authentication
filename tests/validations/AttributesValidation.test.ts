import { AttributesValidationOptions, Authentication } from '../../src'
import AttributesValidation from '../../src/validations/AttributesValidation'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe('AttributeValidation', (): void => {
  describe('not setting anything or false', (): void => {
    it('validates all as valid', async (): Promise<void> => {
      const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
      const options: AttributesValidationOptions = {
        email: false,
        firstName: false,
        lastName: false,
        name: false,
        password: false,
        phone: false,
        username: false
      }
      const validation = new AttributesValidation(authentication, options)

      const result = await validation.validate({})

      expect(result).toEqual({ errors: {}, valid: true })
    })
  })

  describe('providing empty objects for all attributes', (): void => {
    it('validates email and phone formats as basic baseline', async (): Promise<void> => {
      const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
      const options: AttributesValidationOptions = {
        email: {},
        firstName: {},
        lastName: {},
        name: {},
        password: {},
        phone: {},
        username: {}
      }
      const validation = new AttributesValidation(authentication, options)

      const result = await validation.validate({})

      expect(result).toEqual({ errors: { email: ['invalid-email'], phone: ['invalid-phone'] }, valid: false })
    })
  })

  describe('providing a validator', (): void => {
    it('validates using validator', async (): Promise<void> => {
      const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
      const options: AttributesValidationOptions = {
        email: { validator: jest.fn().mockReturnValue(false) },
        firstName: { validator: jest.fn().mockReturnValue(false) },
        lastName: { validator: jest.fn().mockReturnValue(false) },
        name: { validator: jest.fn().mockReturnValue(false) },
        password: { validator: jest.fn().mockReturnValue(false) },
        phone: { validator: jest.fn().mockReturnValue(false) },
        username: { validator: jest.fn().mockReturnValue(false) }
      }
      const validation = new AttributesValidation(authentication, options)

      const result = await validation.validate({})

      expect(result).toEqual({
        errors: {
          email: ['invalid-email'],
          firstName: ['invalid-first-name'],
          lastName: ['invalid-last-name'],
          name: ['invalid-name'],
          password: ['invalid-password'],
          phone: ['invalid-phone'],
          username: ['invalid-username']
        },
        valid: false
      })
    })
  })

  describe('setting optional true for undefined values', (): void => {
    it('validates only if the value is not undefined', async (): Promise<void> => {
      const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
      const options: AttributesValidationOptions = {
        email: { optional: true, validator: jest.fn().mockReturnValue(false) },
        firstName: { optional: true, validator: jest.fn().mockReturnValue(false) },
        lastName: { optional: true, validator: jest.fn().mockReturnValue(false) },
        name: { optional: true, validator: jest.fn().mockReturnValue(false) },
        password: { optional: true, validator: jest.fn().mockReturnValue(false) },
        phone: { optional: true, validator: jest.fn().mockReturnValue(false) },
        username: { optional: true, validator: jest.fn().mockReturnValue(false) }
      }
      const validation = new AttributesValidation(authentication, options)

      const result = await validation.validate({})

      expect(result).toEqual({ errors: {}, valid: true })
    })

    it('validates only if the value is not null', async (): Promise<void> => {
      const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
      const options: AttributesValidationOptions = {
        email: { optional: true, validator: jest.fn().mockReturnValue(false) },
        firstName: { optional: true, validator: jest.fn().mockReturnValue(false) },
        lastName: { optional: true, validator: jest.fn().mockReturnValue(false) },
        name: { optional: true, validator: jest.fn().mockReturnValue(false) },
        password: { optional: true, validator: jest.fn().mockReturnValue(false) },
        phone: { optional: true, validator: jest.fn().mockReturnValue(false) },
        username: { optional: true, validator: jest.fn().mockReturnValue(false) }
      }
      const validation = new AttributesValidation(authentication, options)

      const result = await validation.validate({ email: null, firstName: null, lastName: null, name: null, password: null, phone: null, username: null })

      expect(result).toEqual({ errors: {}, valid: true })
    })
  })

  describe('providing a matcher', (): void => {
    it('validates using the matcher', async (): Promise<void> => {
      const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
      const options: AttributesValidationOptions = {
        email: { matcher: /hola/g },
        firstName: { matcher: /hola/g },
        lastName: { matcher: /hola/g },
        name: { matcher: /hola/g },
        password: { matcher: /hola/g },
        phone: { matcher: /hola/g },
        username: { matcher: /hola/g }
      }
      const validation = new AttributesValidation(authentication, options)

      const result = await validation.validate({})

      expect(result).toEqual({
        errors: {
          email: ['invalid-email'],
          firstName: ['invalid-first-name'],
          lastName: ['invalid-last-name'],
          name: ['invalid-name'],
          password: ['invalid-password'],
          phone: ['invalid-phone'],
          username: ['invalid-username']
        },
        valid: false
      })
    })
  })

  describe('providing a size constrain', (): void => {
    it('validates using the size constrain additionally', async (): Promise<void> => {
      const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
      const options: AttributesValidationOptions = {
        email: { matcher: /hola/g, size: { min: 1, max: 2 } },
        firstName: { matcher: /hola/g, size: { min: 1, max: 2 } },
        lastName: { matcher: /hola/g, size: { min: 1, max: 2 } },
        name: { matcher: /hola/g, size: { min: 1, max: 2 } },
        password: { matcher: /hola/g, size: { min: 1, max: 2 } },
        phone: { matcher: /hola/g, size: { min: 1, max: 2 } },
        username: { matcher: /hola/g, size: { min: 1, max: 2 } }
      }
      const validation = new AttributesValidation(authentication, options)

      const result = await validation.validate({})

      expect(result).toEqual({
        errors: {
          email: ['invalid-email', 'email-out-of-size'],
          firstName: ['invalid-first-name', 'first-name-out-of-size'],
          lastName: ['invalid-last-name', 'last-name-out-of-size'],
          name: ['invalid-name', 'name-out-of-size'],
          password: ['invalid-password', 'password-out-of-size'],
          phone: ['invalid-phone', 'phone-out-of-size'],
          username: ['invalid-username', 'username-out-of-size']
        },
        valid: false
      })
    })
  })

  describe('when email, phone and username are valid', (): void => {
    it('validates the existence through authenticatable class', async (): Promise<void> => {
      const authentication = new Authentication({ secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
      const options: AttributesValidationOptions = {
        email: {},
        firstName: {},
        lastName: {},
        name: {},
        password: {},
        phone: {},
        username: {}
      }
      const validation = new AttributesValidation(authentication, options)

      let result = await validation.validate({ email: 'exists@email.com', phone: '+524491234567', username: 'exists' })

      expect(result).toEqual({
        errors: {
          email: ['email-in-use'],
          phone: ['phone-in-use'],
          username: ['username-in-use']
        },
        valid: false
      })

      result = await validation.validate({ email: 'nop@email.com', phone: '+524497654321', username: 'nop' })

      expect(result).toEqual({ errors: {}, valid: true })
    })
  })
})

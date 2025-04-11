import Authentication from '../../../src/Authentication'
import UserExistsWithEmailDynamic from '../../../src/default-module/UserExistsWithEmail.universal-auth-dynamic'
import UserValidation from '../../../src/default-module/validations/UserValidation'
import { DefaultModuleDynamicNames, DefaultModuleOptions } from '../../../src/types'

describe('UserValidation', (): void => {
  describe('email validation', (): void => {
    it('validates email presence', async (): Promise<void> => {
      // Initialize authentication for this test
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      // Create default options for this test
      const defaultOptions: DefaultModuleOptions = {
        emailValidation: {
          matcher: new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
          size: { min: 6, max: 256 }
        },
        passwordValidation: {
          size: { min: 8, max: 256 }
        }
      }

      const validation = new UserValidation({}, authentication, defaultOptions)

      // Test with missing email
      const result = await validation.validate({ password: 'password123' }, 'sign-up')

      expect(result.valid).toBe(false)
      expect(result.errors.email).toContain('email-should-be-present')
    })

    it('validates email size', async (): Promise<void> => {
      // Initialize authentication for this test
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      // Create default options for this test
      const defaultOptions: DefaultModuleOptions = {
        emailValidation: {
          matcher: new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
          size: { min: 6, max: 256 }
        },
        passwordValidation: {
          size: { min: 8, max: 256 }
        }
      }

      const validation = new UserValidation({}, authentication, defaultOptions)

      // Test with too short email
      const tooShortResult = await validation.validate(
        {
          email: 'a@b.c',
          password: 'password123'
        },
        'sign-up'
      )

      expect(tooShortResult.valid).toBe(false)
      expect(tooShortResult.errors.email).toContain('email-should-be-right-sized')

      // Test with too long email
      const longEmail = 'a'.repeat(250) + '@example.com'
      const tooLongResult = await validation.validate(
        {
          email: longEmail,
          password: 'password123'
        },
        'sign-up'
      )

      expect(tooLongResult.valid).toBe(false)
      expect(tooLongResult.errors.email).toContain('email-should-be-right-sized')
    })

    it('validates email format', async (): Promise<void> => {
      // Initialize authentication for this test
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      // Create default options for this test
      const defaultOptions: DefaultModuleOptions = {
        emailValidation: {
          matcher: new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
          size: { min: 6, max: 256 }
        },
        passwordValidation: {
          size: { min: 8, max: 256 }
        }
      }

      const validation = new UserValidation({}, authentication, defaultOptions)

      // Test with invalid email format
      const result = await validation.validate(
        {
          email: 'not_an_email',
          password: 'password123'
        },
        'sign-up'
      )

      expect(result.valid).toBe(false)
      expect(result.errors.email).toContain('email-should-be-valid')
    })

    it('applies custom email options when provided', async (): Promise<void> => {
      // Initialize authentication for this test
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      // Mock dynamic behavior for this test
      dynamicApiJest.mockDynamicReturnValue(UserExistsWithEmailDynamic, false)

      const customOptions: DefaultModuleOptions = {
        emailValidation: {
          matcher: new RegExp('^[a-zA-Z0-9]+@example\\.org$'), // Only allows @example.org emails
          size: { min: 10, max: 100 }
        }
      }

      const validation = new UserValidation({}, authentication, customOptions)

      // Test with valid email according to custom rules
      const validResult = await validation.validate(
        {
          email: 'username@example.org',
          password: 'strongpassword123'
        },
        'sign-up'
      )

      expect(validResult.valid).toBe(true)

      // Test with invalid email format according to custom matcher
      const invalidEmailResult = await validation.validate(
        {
          email: 'user@example.com', // Not .org domain
          password: 'strongpassword123'
        },
        'sign-up'
      )

      expect(invalidEmailResult.valid).toBe(false)
      expect(invalidEmailResult.errors.email).toContain('email-should-be-valid')
    })

    it('validates email uniqueness for sign-up', async (): Promise<void> => {
      // Initialize authentication for this test
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      // Create default options for this test
      const defaultOptions: DefaultModuleOptions = {
        emailValidation: {
          matcher: new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
          size: { min: 6, max: 256 }
        },
        passwordValidation: {
          size: { min: 8, max: 256 }
        }
      }

      // Mock that the email is already taken
      dynamicApiJest.mockDynamicReturnValue(UserExistsWithEmailDynamic, true)

      const validation = new UserValidation({}, authentication, defaultOptions)

      // Test with already taken email
      const result = await validation.validate(
        {
          email: 'taken@example.com',
          password: 'password123'
        },
        'sign-up'
      )

      expect(result.valid).toBe(false)
      expect(result.errors.email).toContain('email-should-be-unique')
      expect(UserExistsWithEmailDynamic).toHaveBeenPerformedWith({ email: 'taken@example.com' })
    })

    it('bypasses uniqueness check if email unchanged during update', async (): Promise<void> => {
      // Initialize authentication for this test
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      // Create default options for this test
      const defaultOptions: DefaultModuleOptions = {
        emailValidation: {
          matcher: new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
          size: { min: 6, max: 256 }
        },
        passwordValidation: {
          size: { min: 8, max: 256 }
        }
      }

      // Set initial values to simulate an update operation
      const validation = new UserValidation({ email: 'taken@example.com' }, authentication, defaultOptions)

      // Test with the same email (should pass uniqueness check)
      const result = await validation.validate(
        {
          email: 'taken@example.com',
          password: 'password123'
        },
        'update'
      )

      expect(result.valid).toBe(true)
      // No dynamic performed because the email is unchanged
      expect(UserExistsWithEmailDynamic).not.toHaveBeenPerformed()
    })

    it('validates email for log-in schema', async (): Promise<void> => {
      // Initialize authentication for this test
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      // Create default options for this test
      const defaultOptions: DefaultModuleOptions = {
        emailValidation: {
          matcher: new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
          size: { min: 6, max: 256 }
        },
        passwordValidation: {
          size: { min: 8, max: 256 }
        }
      }

      // Even if email exists, login validation doesn't check uniqueness
      dynamicApiJest.mockDynamicReturnValue(UserExistsWithEmailDynamic, true)

      const validation = new UserValidation({}, authentication, defaultOptions)

      // Email uniqueness is NOT checked for log-in, only format
      const result = await validation.validate(
        {
          email: 'taken@example.com',
          password: 'password123'
        },
        'log-in'
      )

      expect(result.valid).toBe(true)
      // UserExistsWithEmailDynamic should not be called during login validation
      expect(UserExistsWithEmailDynamic).not.toHaveBeenPerformed()
    })
  })

  describe('password validation', (): void => {
    it('validates password presence', async (): Promise<void> => {
      // Initialize authentication for this test
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      // Create default options for this test
      const defaultOptions: DefaultModuleOptions = {
        emailValidation: {
          matcher: new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
          size: { min: 6, max: 256 }
        },
        passwordValidation: {
          size: { min: 8, max: 256 }
        }
      }

      const validation = new UserValidation({}, authentication, defaultOptions)

      // Test with missing password
      const result = await validation.validate(
        {
          email: 'test@example.com'
        },
        'sign-up'
      )

      expect(result.valid).toBe(false)
      expect(result.errors.password).toContain('password-should-be-present')
    })

    it('validates password size', async (): Promise<void> => {
      // Initialize authentication for this test
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      // Create default options for this test
      const defaultOptions: DefaultModuleOptions = {
        emailValidation: {
          matcher: new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
          size: { min: 6, max: 256 }
        },
        passwordValidation: {
          size: { min: 8, max: 256 }
        }
      }

      const validation = new UserValidation({}, authentication, defaultOptions)

      // Test with too short password
      const tooShortResult = await validation.validate(
        {
          email: 'test@example.com',
          password: 'short'
        },
        'sign-up'
      )

      expect(tooShortResult.valid).toBe(false)
      expect(tooShortResult.errors.password).toContain('password-should-be-right-sized')

      // Test with too long password
      const longPassword = 'a'.repeat(300)
      const tooLongResult = await validation.validate(
        {
          email: 'test@example.com',
          password: longPassword
        },
        'sign-up'
      )

      expect(tooLongResult.valid).toBe(false)
      expect(tooLongResult.errors.password).toContain('password-should-be-right-sized')
    })

    it('applies custom password options when provided', async (): Promise<void> => {
      // Initialize authentication for this test
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      // Mock dynamic behavior for this test
      dynamicApiJest.mockDynamicReturnValue(UserExistsWithEmailDynamic, false)

      const customOptions: DefaultModuleOptions = {
        passwordValidation: {
          size: { min: 12, max: 100 }
        }
      }

      const validation = new UserValidation({}, authentication, customOptions)

      // Test with valid password according to custom rules
      const validResult = await validation.validate(
        {
          email: 'username@example.org',
          password: 'strongpassword123'
        },
        'sign-up'
      )

      expect(validResult.valid).toBe(true)

      // Test with too short password according to custom size
      const invalidPasswordResult = await validation.validate(
        {
          email: 'username@example.org',
          password: 'short'
        },
        'sign-up'
      )

      expect(invalidPasswordResult.valid).toBe(false)
      expect(invalidPasswordResult.errors.password).toContain('password-should-be-right-sized')
    })

    it('validates password for update schema', async (): Promise<void> => {
      // Initialize authentication for this test
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      // Create default options for this test
      const defaultOptions: DefaultModuleOptions = {
        emailValidation: {
          matcher: new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
          size: { min: 6, max: 256 }
        },
        passwordValidation: {
          size: { min: 8, max: 256 }
        }
      }

      const validation = new UserValidation({}, authentication, defaultOptions)

      // Providing an invalid password in update still validates it
      const result = await validation.validate(
        {
          password: 'short'
        },
        'update'
      )

      expect(result.valid).toBe(false)
      expect(result.errors.password).toContain('password-should-be-right-sized')
    })

    it('makes password optional for update schema', async (): Promise<void> => {
      // Initialize authentication for this test
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      // Create default options for this test
      const defaultOptions: DefaultModuleOptions = {
        emailValidation: {
          matcher: new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
          size: { min: 6, max: 256 }
        },
        passwordValidation: {
          size: { min: 8, max: 256 }
        }
      }

      const validation = new UserValidation({}, authentication, defaultOptions)

      // Password is optional for update schema
      const result = await validation.validate({}, 'update')

      expect(result.valid).toBe(true)
    })
  })
})

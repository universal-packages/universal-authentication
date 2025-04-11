import Authentication from '../../../src/Authentication'
import UserExistsWithEmailDynamic from '../../../src/default-module/UserExistsWithEmail.universal-auth-dynamic'
import DefaultModuleValidation from '../../../src/default-module/validations/DefaultModuleValidation'
import { DefaultModuleDynamicNames, DefaultModuleOptions } from '../../../src/types'

describe(DefaultModuleValidation, (): void => {
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

      const validation = new DefaultModuleValidation({}, authentication, defaultOptions)

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

      const validation = new DefaultModuleValidation({}, authentication, defaultOptions)

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

      const validation = new DefaultModuleValidation({}, authentication, defaultOptions)

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

      const validation = new DefaultModuleValidation({}, authentication, customOptions)

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

      const validation = new DefaultModuleValidation({}, authentication, defaultOptions)

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
      const validation = new DefaultModuleValidation({ email: 'taken@example.com' }, authentication, defaultOptions)

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

      const validation = new DefaultModuleValidation({}, authentication, defaultOptions)

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

      const validation = new DefaultModuleValidation({}, authentication, defaultOptions)

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

      const validation = new DefaultModuleValidation({}, authentication, defaultOptions)

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

      const validation = new DefaultModuleValidation({}, authentication, customOptions)

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

      const validation = new DefaultModuleValidation({}, authentication, defaultOptions)

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

      const validation = new DefaultModuleValidation({}, authentication, defaultOptions)

      // Password is optional for update schema
      const result = await validation.validate({}, 'update')

      expect(result.valid).toBe(true)
    })
  })

  describe('locale validation', (): void => {
    it('validates locale presence for sign-up when not optional', async (): Promise<void> => {
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      const validation = new DefaultModuleValidation({}, authentication, { localeValidation: { optional: false } })

      // Test with missing locale
      const result = await validation.validate(
        {
          email: 'test@example.com',
          password: 'password123'
        },
        'sign-up'
      )

      expect(result.valid).toBe(false)
      expect(result.errors.locale).toContain('locale-should-be-present')
    })

    it('makes locale optional by default', async (): Promise<void> => {
      // Initialize authentication for this test
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      // Using default options (locale is optional)
      const validation = new DefaultModuleValidation({}, authentication, {})

      // Test with missing locale but valid email/password
      const result = await validation.validate(
        {
          email: 'test@example.com',
          password: 'password123'
        },
        'sign-up'
      )

      expect(result.valid).toBe(true)
    })

    it('validates locale format', async (): Promise<void> => {
      // Initialize authentication for this test
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      const validation = new DefaultModuleValidation({}, authentication, {})

      // Test with invalid locale
      const invalidResult = await validation.validate(
        {
          email: 'test@example.com',
          password: 'password123',
          locale: 'not-a-locale'
        },
        'sign-up'
      )

      expect(invalidResult.valid).toBe(false)
      expect(invalidResult.errors.locale).toContain('locale-should-be-a-valid-locale')

      // Test with valid locale
      const validResult = await validation.validate(
        {
          email: 'test@example.com',
          password: 'password123',
          locale: 'en-US'
        },
        'sign-up'
      )

      expect(validResult.valid).toBe(true)
    })

    it('validates locale for initial-details schema', async (): Promise<void> => {
      // Initialize authentication for this test
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      // Create validation with locale not optional
      const validation = new DefaultModuleValidation({}, authentication, {
        localeValidation: { optional: false }
      })

      // Test with missing locale
      const missingResult = await validation.validate(
        {
          timezone: 'America/New_York'
        },
        'initial-details'
      )

      expect(missingResult.valid).toBe(false)
      expect(missingResult.errors.locale).toContain('locale-should-be-present')

      // Test with invalid locale
      const invalidResult = await validation.validate(
        {
          locale: 'not-a-locale',
          timezone: 'America/New_York'
        },
        'initial-details'
      )

      expect(invalidResult.valid).toBe(false)
      expect(invalidResult.errors.locale).toContain('locale-should-be-a-valid-locale')

      // Test with valid locale
      const validResult = await validation.validate(
        {
          locale: 'en-US',
          timezone: 'America/New_York'
        },
        'initial-details'
      )

      expect(validResult.valid).toBe(true)
    })
  })

  describe('timezone validation', (): void => {
    it('validates timezone presence for sign-up when not optional', async (): Promise<void> => {
      // Initialize authentication for this test
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      // Create custom DefaultModuleValidation with timezoneOptional set to false
      const validation = new DefaultModuleValidation({}, authentication, { timezoneValidation: { optional: false } })
      // Test with missing timezone
      const result = await validation.validate(
        {
          email: 'test@example.com',
          password: 'password123'
        },
        'sign-up'
      )

      expect(result.valid).toBe(false)
      expect(result.errors.timezone).toContain('timezone-should-be-present')
    })

    it('makes timezone optional by default', async (): Promise<void> => {
      // Initialize authentication for this test
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      // Using default options (timezone is optional)
      const validation = new DefaultModuleValidation({}, authentication, {})

      // Test with missing timezone but valid email/password
      const result = await validation.validate(
        {
          email: 'test@example.com',
          password: 'password123'
        },
        'sign-up'
      )

      expect(result.valid).toBe(true)
    })

    it('validates timezone format', async (): Promise<void> => {
      // Initialize authentication for this test
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      const validation = new DefaultModuleValidation({}, authentication, {})

      // Test with invalid timezone
      const invalidResult = await validation.validate(
        {
          email: 'test@example.com',
          password: 'password123',
          timezone: 'Not/A/Timezone'
        },
        'sign-up'
      )

      expect(invalidResult.valid).toBe(false)
      expect(invalidResult.errors.timezone).toContain('timezone-should-be-a-valid-timezone')

      // Test with valid timezone
      const validResult = await validation.validate(
        {
          email: 'test@example.com',
          password: 'password123',
          timezone: 'America/New_York'
        },
        'sign-up'
      )

      expect(validResult.valid).toBe(true)
    })

    it('validates timezone for initial-details schema', async (): Promise<void> => {
      // Initialize authentication for this test
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      // Create validation with timezone not optional
      const validation = new DefaultModuleValidation({}, authentication, {
        timezoneValidation: { optional: false }
      })

      // Test with missing timezone
      const missingResult = await validation.validate(
        {
          locale: 'en-US'
        },
        'initial-details'
      )

      expect(missingResult.valid).toBe(false)
      expect(missingResult.errors.timezone).toContain('timezone-should-be-present')

      // Test with invalid timezone
      const invalidResult = await validation.validate(
        {
          locale: 'en-US',
          timezone: 'Not/A/Timezone'
        },
        'initial-details'
      )

      expect(invalidResult.valid).toBe(false)
      expect(invalidResult.errors.timezone).toContain('timezone-should-be-a-valid-timezone')

      // Test with valid timezone
      const validResult = await validation.validate(
        {
          locale: 'en-US',
          timezone: 'America/New_York'
        },
        'initial-details'
      )

      expect(validResult.valid).toBe(true)
    })
  })
})

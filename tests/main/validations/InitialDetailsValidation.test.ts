import Authentication from '../../../src/Authentication'
import DefaultModuleValidation from '../../../src/default-module/validations/DefaultModuleValidation'
import { DefaultModuleDynamicNames } from '../../../src/types'
import InitialDetailsValidation from '../../../src/validations/InitialDetailsValidation'

describe(InitialDetailsValidation, (): void => {
  describe('locale validation', (): void => {
    it('validates locale presence for sign-up when not optional', async (): Promise<void> => {
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123', initialDetails: { localeValidation: { optional: false } } })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      const validation = new DefaultModuleValidation({}, authentication, {})

      // Test with missing locale
      const result = await validation.validate({}, 'initial-details')

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
      const result = await validation.validate({}, 'initial-details')

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
          locale: 'not-a-locale'
        },
        'initial-details'
      )

      expect(invalidResult.valid).toBe(false)
      expect(invalidResult.errors.locale).toContain('locale-should-be-a-valid-locale')

      // Test with valid locale
      const validResult = await validation.validate(
        {
          locale: 'en-US'
        },
        'initial-details'
      )

      expect(validResult.valid).toBe(true)
    })
  })

  describe('timezone validation', (): void => {
    it('validates timezone presence for sign-up when not optional', async (): Promise<void> => {
      // Initialize authentication for this test
      const authentication = new Authentication<DefaultModuleDynamicNames>({
        dynamicsLocation: './src',
        secret: '123',
        initialDetails: { timezoneValidation: { optional: false } }
      })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      // Create custom DefaultModuleValidation with timezoneOptional set to false
      const validation = new DefaultModuleValidation({}, authentication, {})
      // Test with missing timezone
      const result = await validation.validate({}, 'initial-details')

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
      const result = await validation.validate({}, 'initial-details')

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
          timezone: 'Not/A/Timezone'
        },
        'initial-details'
      )

      expect(invalidResult.valid).toBe(false)
      expect(invalidResult.errors.timezone).toContain('timezone-should-be-a-valid-timezone')

      // Test with valid timezone
      const validResult = await validation.validate(
        {
          timezone: 'America/New_York'
        },
        'initial-details'
      )

      expect(validResult.valid).toBe(true)
    })
  })
})

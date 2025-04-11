import { Authentication, DefaultModuleDynamicNames } from '../../src'
import ValidateInitialDetailsDynamic from '../../src/ValidateInitialDetails.universal-auth-dynamic'

describe(Authentication, (): void => {
  describe(ValidateInitialDetailsDynamic, (): void => {
    it('validates initial details', async (): Promise<void> => {
      const authentication = new Authentication<DefaultModuleDynamicNames>({ dynamicsLocation: './src', secret: '123' })
      authentication.options['namespace'] = 'universal-auth'
      await authentication.loadDynamics()

      const result = await authentication.performDynamic('validate-initial-details', { locale: 'en-US', timezone: 'America/New_York' })

      expect(result).toEqual({
        errors: {},
        valid: true
      })
    })
  })
})

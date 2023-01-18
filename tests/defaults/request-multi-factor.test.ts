import { Authentication, CredentialKind } from '../../src'
import TestAuthenticatable from '../__fixtures__/TestAuthenticatable'

describe('Authentication', (): void => {
  describe('default-dynamics', (): void => {
    describe('request-multi-factor', (): void => {
      const credentialKinds: CredentialKind[] = ['email', 'phone']

      credentialKinds.forEach((credentialKind: CredentialKind): void => {
        describe(`when using ${credentialKind} to request multi-factor`, (): void => {
          describe('and multi-factor is enabled', (): void => {
            describe('when using authenticatable as payload param', (): void => {
              describe('and authenticatable has multi-factor active (it has log in successfully)', (): void => {
                it('returns success', async (): Promise<void> => {
                  const authentication = new Authentication(
                    { [credentialKind]: { enableMultiFactor: true }, secret: '123', dynamicsLocation: './src/defaults' },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const result = await authentication.performDynamic('request-multi-factor', { identifier: 'any.multi-factor-active', credentialKind })

                  expect(result).toEqual({ status: 'success' })
                })
              })

              describe('and authenticatable has multi-factor inactive', (): void => {
                it('returns waring', async (): Promise<void> => {
                  const authentication = new Authentication(
                    { [credentialKind]: { enableMultiFactor: true }, secret: '123', dynamicsLocation: './src/defaults' },
                    TestAuthenticatable
                  )
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const result = await authentication.performDynamic('request-multi-factor', { identifier: 'any.multi-factor-inactive', credentialKind })

                  expect(result).toEqual({ status: 'warning', message: 'nothing-to-do' })
                })
              })
            })
          })

          describe('and authenticatable', (): void => {
            it('returns failure', async (): Promise<void> => {
              const authentication = new Authentication({ [credentialKind]: { enableMultiFactor: false }, secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const result = await authentication.performDynamic('request-multi-factor', { identifier: 'any.nothing', credentialKind })

              expect(result).toEqual({ status: 'failure', message: 'nothing-to-do' })
            })
          })
        })
      })
    })
  })
})

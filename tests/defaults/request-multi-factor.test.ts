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
                  const authentication = new Authentication({ enableMultiFactor: true, secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const authenticatable = TestAuthenticatable.findByCredential(`${credentialKind}-multi-factor-active`)

                  const result = await authentication.performDynamic('request-multi-factor', { authenticatable, credentialKind })

                  expect(result).toEqual({ status: 'success', metadata: { oneTimePassword: expect.any(String) } })
                })
              })

              describe('and authenticatable has multi-factor inactive', (): void => {
                it('returns waring', async (): Promise<void> => {
                  const authentication = new Authentication({ enableMultiFactor: true, secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const authenticatable = TestAuthenticatable.findByCredential(`${credentialKind}-multi-factor-inactive`)

                  const result = await authentication.performDynamic('request-multi-factor', { authenticatable, credentialKind })

                  expect(result).toEqual({ status: 'warning', message: 'nothing-to-do' })
                })
              })
            })

            describe('when using credential as payload param', (): void => {
              describe('and authenticatable has multi-factor active (it has log in successfully)', (): void => {
                it('returns success', async (): Promise<void> => {
                  const authentication = new Authentication({ enableMultiFactor: true, secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const result = await authentication.performDynamic('request-multi-factor', { credential: `${credentialKind}-multi-factor-active`, credentialKind })

                  expect(result).toEqual({ status: 'success', metadata: { oneTimePassword: expect.any(String) } })
                })
              })

              describe('and authenticatable has multi-factor inactive', (): void => {
                it('returns waring', async (): Promise<void> => {
                  const authentication = new Authentication({ enableMultiFactor: true, secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
                  authentication.options['namespace'] = 'universal-auth'
                  await authentication.loadDynamics()

                  const result = await authentication.performDynamic('request-multi-factor', { credential: `${credentialKind}-multi-factor-inactive`, credentialKind })

                  expect(result).toEqual({ status: 'warning', message: 'nothing-to-do' })
                })
              })
            })
          })

          describe('and multi-factor is not enabled', (): void => {
            it('returns failure', async (): Promise<void> => {
              const authentication = new Authentication({ enableMultiFactor: false, secret: '123', dynamicsLocation: './src/defaults' }, TestAuthenticatable)
              authentication.options['namespace'] = 'universal-auth'
              await authentication.loadDynamics()

              const result = await authentication.performDynamic('request-multi-factor', { credential: '', credentialKind })

              expect(result).toEqual({ status: 'failure', message: 'multi-factor-disabled' })
            })
          })
        })
      })
    })
  })
})

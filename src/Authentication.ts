import { DynamicApi } from '@universal-packages/dynamic-api'

import { AuthDynamicNames, AuthenticatableClass, AuthenticationOptions, ExtensibleUnion } from './types'

export default class Authentication<D extends Record<string, any> = AuthDynamicNames, A = AuthenticatableClass> extends DynamicApi<D> {
  public readonly options: AuthenticationOptions
  public Authenticatable?: A

  public constructor(options: AuthenticationOptions, AuthenticatableClass?: A) {
    const newOptions: AuthenticationOptions = {
      ...options,
      defaultModule: {
        enabled: true,
        ...options.defaultModule
      }
    }

    super({ ...newOptions, namespace: 'auth', accumulate: true, modules: { default: newOptions.defaultModule, ...newOptions.modules } })

    this.Authenticatable = AuthenticatableClass
  }

  public setAuthenticatableClass(Authenticatable?: A): void {
    this.Authenticatable = Authenticatable
  }

  public async performDynamic<N extends keyof D>(name: ExtensibleUnion<N>, payload?: D[N]['payload']): Promise<D[N]['result']> {
    return await super.performDynamic(name as string, payload)
  }

  public performDynamicSync<N extends keyof D>(name: ExtensibleUnion<N>, payload?: D[N]['payload']): D[N]['result'] {
    return super.performDynamicSync(name as string, payload)
  }
}

import { DynamicApi } from '@universal-packages/dynamic-api'
import { AuthDynamicNames, AuthenticatableClass, AuthenticationOptions, ExtensibleUnion } from './Authentication.types'

export default class Authentication<D extends Record<string, any> = AuthDynamicNames> extends DynamicApi<D> {
  public readonly options: AuthenticationOptions
  public Authenticatable?: AuthenticatableClass

  public constructor(options: AuthenticationOptions, Authenticatable?: AuthenticatableClass) {
    const newOptions: AuthenticationOptions = {
      maxAttemptsUntilLock: 5,
      multiFactorActivityLimit: '5 minutes',
      ...options,
      email: {
        enablePasswordCheck: true,
        enforcePasswordCheck: true,
        sendMultiFactorInPlace: true,
        enableSignUp: true,
        ...options.email
      },
      phone: {
        enableMultiFactor: true,
        enforceMultiFactor: true,
        sendMultiFactorInPlace: true,
        enableCorroboration: true,
        enableSignUp: true,
        ...options.phone
      },
      validations: {
        password: { size: { min: 8, max: 256 } },
        username: { matcher: /^[a-zA-Z.0-9_\-&]+$/i },
        email: {},
        phone: {},
        ...options.validations
      },
      providerKeys: { ...options.providerKeys }
    }

    super({ ...newOptions, namespace: 'auth' })

    this.Authenticatable = Authenticatable
  }

  public setAuthenticatable(Authenticatable?: AuthenticatableClass): void {
    this.Authenticatable = Authenticatable
  }

  public async performDynamic<N extends keyof D>(name: ExtensibleUnion<N>, payload?: D[N]['payload']): Promise<D[N]['result']> {
    return await super.performDynamic(name as string, payload)
  }

  public performDynamicSync<N extends keyof D>(name: ExtensibleUnion<N>, payload?: D[N]['payload']): D[N]['result'] {
    return super.performDynamicSync(name as string, payload)
  }
}

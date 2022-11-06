import { DynamicApi } from '@universal-packages/dynamic-api'
import { AuthDynamicNames, AuthenticatableClass, AuthenticationOptions, AuthDynamicPayload, ExtensibleUnion } from './Authentication.types'

export default class Authentication<D extends Record<string, any> = AuthDynamicNames> extends DynamicApi<D> {
  public readonly options: AuthenticationOptions
  public Authenticatable?: AuthenticatableClass

  public constructor(options: AuthenticationOptions, Authenticatable?: AuthenticatableClass) {
    const newOptions: AuthenticationOptions = {
      maxAttemptsUntilLock: 5,
      ...options,
      email: {
        enablePasswordCheck: true,
        ...options.email,
        signUpValidations: {
          email: options.email?.signUpValidations?.email || {},
          firstName: options.email?.signUpValidations?.firstName || false,
          lastName: options.email?.signUpValidations?.lastName || false,
          name: options.email?.signUpValidations?.name || false,
          password: options.email?.signUpValidations?.password || { size: { min: 8, max: 256 } },
          phone: options.email?.signUpValidations?.phone || false,
          username: options.email?.signUpValidations?.username || { matcher: /^[a-zA-Z.0-9_\-&]+$/i }
        }
      },
      phone: {
        ...options.phone,
        signUpValidations: {
          email: options.phone?.signUpValidations?.email || false,
          firstName: options.phone?.signUpValidations?.firstName || false,
          lastName: options.phone?.signUpValidations?.lastName || false,
          name: options.phone?.signUpValidations?.name || false,
          password: options.phone?.signUpValidations?.password || { size: { min: 8, max: 256 } },
          phone: options.phone?.signUpValidations?.phone || {},
          username: options.phone?.signUpValidations?.username || { matcher: /^[a-zA-Z.0-9_\-&]+$/i }
        }
      }
    }

    super({ ...newOptions, namespace: 'auth' })

    this.Authenticatable = Authenticatable
  }

  public setAuthenticatable(Authenticatable?: AuthenticatableClass): void {
    this.Authenticatable = Authenticatable
  }

  public async performDynamic<N extends keyof D>(name: ExtensibleUnion<N>, body?: D[N]['payload']): Promise<D[N]['result']> {
    const payload: AuthDynamicPayload = { body, authOptions: this.options, Authenticatable: this.Authenticatable }

    return await super.performDynamic(name as string, payload)
  }

  public performDynamicSync<N extends keyof D>(name: ExtensibleUnion<N>, body?: D[N]['payload']): D[N]['result'] {
    const payload: AuthDynamicPayload = { body, authOptions: this.options, Authenticatable: this.Authenticatable }

    return super.performDynamicSync(name as string, payload)
  }
}

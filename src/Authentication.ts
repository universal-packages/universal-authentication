import { DynamicApi } from '@universal-packages/dynamic-api'
import { AuthDynamicNames, AuthenticatableClass, AuthenticationOptions, DynamicPayload } from './Authentication.types'

export default class Authentication<D extends Record<string, any> = AuthDynamicNames> extends DynamicApi<D> {
  public Authenticatable?: AuthenticatableClass

  public constructor(options: AuthenticationOptions, Authenticatable?: AuthenticatableClass) {
    const newOptions: AuthenticationOptions = { maxAttemptsUntilLock: 5, ...options }

    super({ ...newOptions, namespace: 'auth' })

    this.Authenticatable = Authenticatable
  }

  public setAuthenticatable(Authenticatable?: AuthenticatableClass): void {
    this.Authenticatable = Authenticatable
  }

  public async performDynamic<N extends keyof D>(name: N, body?: D[N]['payload']): Promise<D[N]['result']> {
    const payload: DynamicPayload = { body, authOptions: this.options, Authenticatable: this.Authenticatable }

    return await super.performDynamic(name, payload)
  }

  public performDynamicSync<N extends keyof D>(name: N, body?: D[N]['payload']): D[N]['result'] {
    const payload: DynamicPayload = { body, authOptions: this.options, Authenticatable: this.Authenticatable }

    return super.performDynamicSync(name, payload)
  }
}

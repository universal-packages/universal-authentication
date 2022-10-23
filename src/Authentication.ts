import { DynamicApi } from '@universal-packages/dynamic-api'
import { AuthenticatableClass, AuthenticationOptions, AuthenticationResult, DynamicPayload } from './Authentication.types'

export default class Authentication extends DynamicApi {
  public Authenticatable?: AuthenticatableClass

  public constructor(options: AuthenticationOptions, Authenticatable?: AuthenticatableClass) {
    const newOptions: AuthenticationOptions = { maxAttemptsUntilLock: 5, ...options }

    super({ ...newOptions, namespace: 'auth' })

    this.Authenticatable = Authenticatable
  }

  public setAuthenticatable(Authenticatable?: AuthenticatableClass): void {
    this.Authenticatable = Authenticatable
  }

  public async performDynamic(name: string, body?: Record<string, any>): Promise<any> {
    const payload: DynamicPayload = { body, authOptions: this.options, Authenticatable: this.Authenticatable }

    return await super.performDynamic(name, payload)
  }

  public performDynamicSync(name: string, body?: Record<string, any>): any {
    const payload: DynamicPayload = { body, authOptions: this.options, Authenticatable: this.Authenticatable }

    return super.performDynamicSync(name, payload)
  }
}

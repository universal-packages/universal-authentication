import { hashSubject } from './crypto'

export { Dynamic as AuthDynamic } from '@universal-packages/dynamic-api'
export { DynamicHook as AuthDynamicHook } from '@universal-packages/dynamic-api'

export function Encrypt(propertyToEncrypt?: string): Function {
  return (_: any, propertyKey: string): PropertyDescriptor => {
    const finalPropertyToEncrypt = propertyToEncrypt || `encrypted${propertyKey.charAt(0).toUpperCase() + propertyKey.slice(1)}`
    const hiddenProperty = `__${propertyKey}`

    return {
      set: function (value: any): any {
        this[finalPropertyToEncrypt] = hashSubject(value)
        this[hiddenProperty] = value
      },
      get: function (): any {
        return this[hiddenProperty]
      }
    }
  }
}

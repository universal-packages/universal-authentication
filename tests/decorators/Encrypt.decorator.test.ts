import { Authentication, Encrypt } from '../../src'

describe(Authentication, (): void => {
  describe(Encrypt, (): void => {
    it('encrypts a class property', async (): Promise<void> => {
      class Test {
        @Encrypt()
        public password: string
        public encryptedPassword: string

        @Encrypt('hashedPassword')
        public password2: string
        public hashedPassword: string
      }

      const test = new Test()

      test.password = 'password'
      test.password2 = 'password2'

      expect(test).toMatchObject({
        __password: 'password',
        encryptedPassword: expect.any(String),
        __password2: 'password2',
        hashedPassword: expect.any(String)
      })
      expect(test.password).toBe('password')
      expect(test.password2).toBe('password2')
    })
  })
})

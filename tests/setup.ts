import TestAuthenticatable from './__fixtures__/TestAuthenticatable'

jest.retryTimes(10)
jest.setTimeout(10000)

beforeEach((): void => {
  TestAuthenticatable.lastInstance = undefined
})

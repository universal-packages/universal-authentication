import TestAuthenticatable from './__fixtures__/TestAuthenticatable'

// node > 19 has some issues with fetch closing sockets on consecutive requests
if (process.env.CI || process.versions.node.startsWith('20')) {
  jest.retryTimes(5)
  jest.setTimeout(10000)
}

beforeEach((): void => {
  TestAuthenticatable.lastInstance = undefined
})

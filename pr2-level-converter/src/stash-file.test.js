/* global test, expect */

const stashFile = require('./stash-file')

test('err without credentials', async () => {
  const buffer = Buffer.alloc(10)
  let err
  try {
    await stashFile('somename', buffer)
  } catch (e) {
    err = e.message
  }
  expect(err).toBeTruthy()
})

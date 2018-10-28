/* global test, expect */

const toHash = require('./to-hash')

test('same input results in same output', () => {
  expect(toHash('aaa')).toBe(toHash('aaa'))
})

test('different input results in different output', () => {
  expect(toHash('aaa')).not.toBe(toHash('bbb'))
})

/* global test, expect */
const safeSplit = require('./safe-split')

test('split on semicolons', () => {
  const result = safeSplit('one;two;three', ';')
  expect(result).toEqual(['one', 'two', 'three'])
})

test('return empty array for falsy values', () => {
  expect(safeSplit()).toEqual([])
  expect(safeSplit(false)).toEqual([])
})

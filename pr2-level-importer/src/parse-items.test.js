/* global test, expect */
const parseItems = require('./parse-items')

test('parse items', () => {
  const items = 'Laser Gun`Mine`Lightning'
  const result = parseItems(items)
  expect(result).toEqual(['Laser Gun', 'Mine', 'Lightning'])
})

test('filter out a hash if it\'s there', () => {
  const items = 'Mine`Lightningaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
  const result = parseItems(items)
  expect(result).toEqual(['Mine', 'Lightning'])
})

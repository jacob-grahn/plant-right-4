/* global test, expect */

const fetchPr2Level = require('./fetch-pr2-level')

test('fetch a pr2 level', async () => {
  const result = await fetchPr2Level(123)
  expect(result.url).toBe('https://pr2hub.com/levels/123.txt')
})

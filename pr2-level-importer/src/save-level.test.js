/* global test, expect, jest */

const saveLevel = require('./save-level')
const stashFile = require('./stash-file')
jest.mock('./stash-file')

test('form a file path', async () => {
  await saveLevel(555, 'somelevel')
  expect(stashFile.lastCallParams).toEqual({
    key: 'pr2/levels/555/555.json',
    buffer: JSON.stringify('somelevel')
  })
})

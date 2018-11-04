/* global test, expect, jest */
const pr2LevelImporter = require('./index')
const stashFile = require('./stash-file')
jest.mock('./fetch-pr2-level')
jest.mock('./stash-file')

test('Import a level from pr2, and import it as a pr4 level', async () => {
  const levelId = 50815
  await pr2LevelImporter({ pathParameters: { levelId } })
  expect(stashFile.lastCallParams).toEqual({ key: 'ok', buffer: 'yay' })
})

/* global test, expect, jest */
const pr2LevelImporter = require('./index')
const stashFile = require('./stash-file')
jest.mock('./fetch-pr2-level')
jest.mock('./stash-file')

test('Import a level from pr2, and import it as a pr4 level', async () => {
  const levelId = 50815
  const result = await pr2LevelImporter.handler({ pathParameters: { levelId } })
  expect(result.statusCode).toBe(200)
  expect(stashFile.lastCallParams.key).toEqual('pr2/levels/50815/50815.json')
  expect(stashFile.lastCallParams.buffer).toBeTruthy()
})

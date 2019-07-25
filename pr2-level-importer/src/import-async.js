const stashFile = require('./stash-file')
const fetchFile = require('./fetch-file')
const importPr2Level = require('./import-pr2-level')

const importAsync = async (event) => {
  try {
    const levelId = event.pathParameters.levelId
    const path = `pr2/levels/${levelId}/status.txt`
    const status = await fetchFile(path) || 'not-started'

    // begin an import if the level has not been imported yet
    if (status === 'not-started') {
      await stashFile(path, 'wip')
      console.log('stashed file', path, 'wip')
      importPr2Level(levelId)
        .then(() => {
          stashFile(path, 'done')
        })
        .catch(console.log) // run async
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ status })
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    }
  }
}

module.exports = { handler: importAsync }

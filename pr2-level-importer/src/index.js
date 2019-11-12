const stashFile = require('./stash-file')
const fetchFile = require('./fetch-file')
const importPr2Level = require('./import-pr2-level')

const httpHandler = async (event) => {
  const levelId = event.pathParameters.levelId
  const path = `pr2/levels/${levelId}/status.txt`

  try {
    let status = await fetchFile(path) || 'not-started'
    status = 'not-started'

    // begin an import if the level has not been imported yet
    if (status === 'not-started') {
      await stashFile(path, 'wip')
      await importPr2Level(levelId)
      await stashFile(path, 'done')
      status = 'done-by-you'
    }

    // otherwise, return the status of the import-in-progress
    return {
      statusCode: 200,
      body: JSON.stringify({ status })
    }

  // handle failure paths
  } catch (e) {
    await stashFile(path, 'error')
    return {
      statusCode: e.message.indexOf('404') === -1 ? 500 : 404,
      body: JSON.stringify({ status: 'error', message: e.message })
    }
  }
}

module.exports = { handler: httpHandler }

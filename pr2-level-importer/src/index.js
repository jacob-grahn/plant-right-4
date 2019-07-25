const fetchPr2Level = require('./fetch-pr2-level')
const parsePr2Level = require('./parse-pr2-level')
const pr2ToPr4 = require('./pr2-to-pr4')
const renderLevel = require('./render-level')
const saveLevel = require('./save-level')
const importPr2Level = require('./import-pr2-level')

const pr2LevelImporter = async (event) => {
  try {
    const levelId = event.pathParameters.levelId
    const renderedPr4Level = await importPr2Level(levelId)
    return { statusCode: 200, body: renderedPr4Level }
  } catch (e) {
    const statusCode = e.message.indexOf('404') >= 0 ? 404 : 500
    console.log(e)
    return { statusCode, body: JSON.stringify({ error: e.message }) }
  }
}

module.exports = { handler: pr2LevelImporter }

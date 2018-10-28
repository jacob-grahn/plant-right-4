const fetchPr2Level = require('./fetch-pr2-level')
const parsePr2Level = require('./parse-pr2-level')
const pr2ToPr4 = require('./pr2-to-pr4')
const renderLevel = require('./render-level')
const saveLevel = require('./save-level')

const pr2LevelImporter = async (event) => {
  try {
    const levelId = event.pathParameters.levelId
    const pr2LevelStr = await fetchPr2Level(levelId)
    const pr2Level = parsePr2Level(pr2LevelStr)
    const pr4Level = pr2ToPr4(pr2Level)
    const renderedPr4Level = await renderLevel(levelId, pr4Level)
    await saveLevel(levelId, renderedPr4Level)
    return { statusCode: 200, body: renderedPr4Level }
  } catch (e) {
    const statusCode = e.message.indexOf('404') >= 0 ? 404 : 500
    return { statusCode, body: JSON.stringify({ error: e.message }) }
  }
}

module.exports = pr2LevelImporter

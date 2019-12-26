const queryString = require('query-string')
const parseMainSections = require('./parse-main-sections')

const parsePr2Level = (pr2Level) => {
  const parsed = queryString.parse(pr2Level)

  const sections = parseMainSections(parsed.data)
  delete parsed.data
  Object.assign(parsed, sections)

  const { art00, art0, art1, art2, art3, art4 } = parsed
  delete parsed.art00
  delete parsed.art0
  delete parsed.art1
  delete parsed.art2
  delete parsed.art3
  delete parsed.art4
  const artLayers = [art00, art0, art1, art2, art3, art4]

  parsed.artLayers = artLayers
  return parsed
}

module.exports = parsePr2Level

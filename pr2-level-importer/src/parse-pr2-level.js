const queryString = require('query-string')
const parseMainSections = require('./parse-main-sections')
const parseItems = require('./parse-items')
const parseBlocks = require('./parse-blocks')
const parseArt = require('./parse-art')

const parsePr2Level = (pr2Level) => {
  const parsed = queryString.parse(pr2Level)

  const sections = parseMainSections(parsed.data)
  delete parsed.data
  Object.assign(parsed, sections)

  const { art1, art2, art3, art4 } = parsed
  delete parsed.art1
  delete parsed.art2
  delete parsed.art3
  delete parsed.art4
  const artLayers = [art1, art2, art3, art4].map(parseArt)

  parsed.artLayers = artLayers
  parsed.items = parseItems(parsed.items)
  parsed.blocks = parseBlocks(parsed.blocks)

  return parsed
}

module.exports = parsePr2Level

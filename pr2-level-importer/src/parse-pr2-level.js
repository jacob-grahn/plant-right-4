const queryString = require('query-string')
const parseMainSections = require('./parse-main-sections')
const parseItems = require('./parse-items')
const parseBlocks = require('./parse-blocks')
const parseArt = require('./parse-art')

const parsePr2Level = (pr2Level) => {
  const parsed = queryString.parse(pr2Level)
  parsed.data = parseMainSections(parsed.data)
  const { blocks, items, art1, art2, art3, art4 } = parsed.data
  const artLayers = [art1, art2, art3, art4].map(parseArt)
  parsed.artLayers = artLayers
  parsed.items = parseItems(items)
  parsed.data.blocks = parseBlocks(blocks)
}

module.exports = parsePr2Level

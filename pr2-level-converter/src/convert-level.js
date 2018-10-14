/**
 * Convert PR2 level file into a Tiled compatible format
 */

const axios = require('axios')
const queryString = require('query-string')
const blockTileset = require('./tilesets/blocks')
const stampTileset = require('./tilesets/stamps')
const parseMainSections = require('./parse-main-sections')
const parseItems = require('./parse-items')
const parseBlocks = require('./parse-blocks')
const parseArt = require('./parse-art')

const url = 'https://pr2hub.com/levels'

/**
 * convert a pr2 level object to a tiled level object
 */
const toTiled = (parsed) => {
  return {
    backgroundcolor: '#FFFFFF',
    width: 100,
    height: 100,
    infinite: true,
    layers: [
      {
        name: 'Tile Layer',
        opacity: 1,
        startx: 0,
        starty: 0,
        type: 'tilelayer',
        visible: true,
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        chunks: parsed.data.blocks
      },
      ...parsed.artLayers
    ],
    orientation: 'orthogonal',
    tileheight: 30,
    tilewidth: 30,
    tiledversion: '1.1.5',
    properties: {
      items: parsed.items,
      note: parsed.note,
      gravity: Number(parsed.gravity),
      song: Number(parsed.song)
    },
    tilesets: [blockTileset, stampTileset]
  }
}

/**
 * Accept an http request with a levelId
 * Load that level from pr2hub
 * parse the level file into a pr2 level object
 * convert the pr2 level object into a Tiled level
 * return the result as JSON
 */
module.exports.handler = async (event) => {
  try {
    const levelId = event.pathParameters.levelId
    const levelUrl = `${url}/${levelId}.txt`
    const result = await axios.get(levelUrl)
    const parsed = queryString.parse(result.data)
    parsed.data = parseMainSections(parsed.data)
    const { blocks, items, art1, art2, art3, art4 } = parsed.data
    parsed.items = parseItems(items)
    parsed.data.blocks = parseBlocks(blocks)
    parsed.artLayers = [art1, art2, art3, art4].map(parseArt)
    const tiled = toTiled(parsed)
    return { statusCode: 200, body: JSON.stringify(tiled) }
  } catch (e) {
    const statusCode = e.message.indexOf('404') >= 0 ? 404 : 500
    return { statusCode, body: JSON.stringify({ error: e.message }) }
  }
}

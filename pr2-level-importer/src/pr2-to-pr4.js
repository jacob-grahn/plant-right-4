const blockTileset = require('./tilesets/blocks')
const stampTileset = require('./tilesets/stamps')
const parseItems = require('./parse-items')
const parseBlocks = require('./parse-blocks')
const parseArt = require('./parse-art')

/**
 * convert a pr2 level object to a tiled level object
 */
const pr2ToPr4 = (pr2Data) => {
  const artLayers = (pr2Data.artLayers || []).map(parseArt)

  // apply parallax settings
  artLayers[0].parallax = 0.25
  artLayers[1].parallax = 0.5
  artLayers[2].parallax = 1
  artLayers[3].parallax = 1
  artLayers[4].parallax = 2
  artLayers[5].parallax = 3

  return {
    backgroundcolor: '#FFFFFF',
    width: 100,
    height: 100,
    infinite: true,
    layers: [
      parseBlocks(pr2Data.blocks, 4),
      ...artLayers
    ],
    orientation: 'orthogonal',
    tileheight: 30,
    tilewidth: 30,
    tiledversion: '1.1.5',
    properties: {
      items: parseItems(pr2Data.items),
      note: pr2Data.note,
      gravity: Number(pr2Data.gravity),
      song: Number(pr2Data.song),
      levelId: Number(pr2Data.levelId)
    },
    tilesets: [blockTileset, stampTileset]
  }
}

module.exports = pr2ToPr4

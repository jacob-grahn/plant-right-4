const blockTileset = require('./tilesets/blocks')
const stampTileset = require('./tilesets/stamps')

/**
 * convert a pr2 level object to a tiled level object
 */
const pr2ToPr4 = (pr2Data) => {
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
        chunks: pr2Data.blocks
      },
      ...pr2Data.artLayers
    ],
    orientation: 'orthogonal',
    tileheight: 30,
    tilewidth: 30,
    tiledversion: '1.1.5',
    properties: {
      items: pr2Data.items,
      note: pr2Data.note,
      gravity: Number(pr2Data.gravity),
      song: Number(pr2Data.song),
      levelId: Number(pr2Data.levelId)
    },
    tilesets: [blockTileset, stampTileset]
  }
}

module.exports = pr2ToPr4

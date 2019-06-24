const renderLines = require('./render-lines')
const { renderSize } = require('./settings')

const renderLayer = async (levelId, layer, firstgid = 1) => {
  const lines = layer.objects.filter(obj => obj.polyline)
  const stamps = layer.objects.filter(obj => obj.gid)
  const imageMetadataList = await renderLines(levelId, lines)
  const tileset = {
    type: 'tileset',
    tilecount: imageMetadataList.length,
    tiles: {},
    firstgid,
    columns: 0,
    grid: {
      height: 1,
      orientation: 'orthogonal',
      width: 1
    },
    margin: 0,
    name: 'rendered-lines',
    spacing: 0,
    tileheight: renderSize,
    tilewidth: renderSize
  }

  for (let i = 0; i < imageMetadataList.length; i++) {
    const metadata = imageMetadataList[i]
    const { x, y, width, height, key } = metadata
    stamps.push({ gid: i + firstgid, x, y: y + renderSize, width, height })
    tileset.tiles[i.toString()] = {
      image: key,
      imageheight: width,
      imagewidth: height
    }
  }

  return {
    renderedLayer: {
      ...layer,
      objects: stamps
    },
    tileset
  }
}

module.exports = renderLayer

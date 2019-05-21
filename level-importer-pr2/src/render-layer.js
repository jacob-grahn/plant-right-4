const renderLines = require('./render-lines')

const renderLayer = async (levelId, layer) => {
  const lines = layer.objects.filter(obj => obj.polyline)
  const stamps = layer.objects.filter(obj => obj.gid)
  const imageMetadataList = await renderLines(levelId, lines)

  for (let i = 0; i < imageMetadataList.length; i++) {
    const metadata = imageMetadataList[i]
    const { x, y, width, height, key } = metadata
    stamps.push({ gid: key, x, y, width, height })
  }

  return {
    ...layer,
    objects: stamps
  }
}

module.exports = renderLayer

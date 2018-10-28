const renderLines = require('./render-lines')
const toHash = require('./to-hash')
const stashFile = require('./stash-file')

const renderLevel = (levelId, pr4Level) => {
  const { layers } = pr4Level
  const artLayers = layers.filter(layer => layer.type === 'objectgroup')
  const otherLayers = layers.filter(layer => layer.type !== 'objectgroup')

  const renderedArtLayers = artLayers.map(layer => {
    const lines = layer.objects.filter(obj => obj.polyline)
    const stamps = layer.objects.filter(obj => obj.gid)
    const images = renderLines(lines)
    images.forEach(image => {
      const hash = toHash(image)
      const key = `pr2/${levelId}/${hash}`
      stashFile(key, image)
      stamps.push({
        gid: key,
        x: image.x,
        y: image.y,
        width: image.width,
        height: image.height
      })
    })
    return stamps
  })

  return {
    ...pr4Level,
    layers: [...otherLayers, ...renderedArtLayers]
  }
}

module.exports = renderLevel

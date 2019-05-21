const renderLayer = require('./render-layer')

const renderLevel = async (levelId, pr4Level) => {
  const { layers } = pr4Level
  const artLayers = layers.filter(layer => layer.type === 'objectgroup')
  const otherLayers = layers.filter(layer => layer.type !== 'objectgroup')
  const renderedArtLayers = []

  for (let i = 0; i < artLayers.length; i++) {
    const layer = artLayers[i]
    const renderedLayer = await renderLayer(levelId, layer)
    renderedArtLayers.push(renderedLayer)
  }

  return {
    ...pr4Level,
    layers: [...otherLayers, ...renderedArtLayers]
  }
}

module.exports = renderLevel

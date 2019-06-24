const renderLayer = require('./render-layer')

const renderLevel = async (levelId, pr4Level) => {
  const { layers } = pr4Level
  const artLayers = layers.filter(layer => layer.type === 'objectgroup')
  const otherLayers = layers.filter(layer => layer.type !== 'objectgroup')
  const renderedArtLayers = []
  const tilesets = []
  let lastgid = 51 // after tile and stamp gids

  for (let i = 0; i < artLayers.length; i++) {
    const layer = artLayers[i]
    const { renderedLayer, tileset } = await renderLayer(levelId, layer, lastgid)
    renderedArtLayers.push(renderedLayer)
    if (tileset.tilecount > 0) {
      lastgid += tileset.tilecount
      tilesets.push(tileset)
    }
  }

  return {
    ...pr4Level,
    layers: [...otherLayers, ...renderedArtLayers],
    tilesets: [...pr4Level.tilesets, ...tilesets]
  }
}

module.exports = renderLevel

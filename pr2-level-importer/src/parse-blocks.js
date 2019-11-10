/**
 * Converts pr2's block format into Tiled infinite tile format
 * @example
 * ['1;1;3', '0;1']
 * becomes
 * [{ height: 4, width: 4, x: 0, y: 0, data: [
 *   0,0,0,0,
 *   0,3,0,0,
 *   0,3,0,0
 * ]}]
 * @returns array of chunks
 */
const parseBlocks = (blockArr = [], chunkSize = 16) => {
  const chunkDict = {}
  let x = 0
  let y = 0
  let tileId = 0

  blockArr.forEach(command => {
    const [moveX, moveY, newTileId] = command.split(';')
    if (newTileId !== undefined) {
      tileId = Number(newTileId) + 1
    }
    x += Number(moveX)
    y += Number(moveY)
    placeTile(chunkDict, chunkSize, x, y, tileId)
  })

  const chunks = Object.values(chunkDict)

  // calculate bounds
  let minPos = { x: Infinity, y: Infinity }
  let maxPos = { x: -Infinity, y: -Infinity }
  chunks.forEach(chunk => {
    minPos.x = Math.min(chunk.x, minPos.x)
    minPos.y = Math.min(chunk.y, minPos.y)
    maxPos.x = Math.max(chunk.x, maxPos.x)
    maxPos.y = Math.max(chunk.y, maxPos.y)
  })

  return {
    opacity: 1,
    startx: 0,
    starty: 0,
    type: 'tilelayer',
    visible: true,
    offsetX: minPos.x * chunkSize,
    offsetY: minPos.y * chunkSize,
    width: maxPos.x - minPos.x + chunkSize,
    height: maxPos.y - minPos.y + chunkSize,
    x: minPos.x,
    y: minPos.y,
    chunks: Object.values(chunkDict)
  }
}

/**
 * @returns void
 * SIDE EFFECT: mutates chunkDict
 */
const placeTile = (chunkDict, chunkSize, x, y, tileId) => {
  const chunkX = Math.floor(x / chunkSize) * chunkSize
  const chunkY = Math.floor(y / chunkSize) * chunkSize
  const innerX = x % chunkSize
  const innerY = y % chunkSize
  const pos = (innerY * chunkSize) + innerX
  const chunkId = `${chunkX},${chunkY}`
  if (!chunkDict[chunkId]) {
    chunkDict[chunkId] = makeChunk(chunkSize, chunkX, chunkY)
  }
  const chunk = chunkDict[chunkId]
  chunk.data[pos] = tileId
}

/**
 * Create a new chunk that is pre-populated with 0's
 */
const makeChunk = (chunkSize, x, y) => {
  const tileCount = chunkSize * chunkSize
  const tiles = []
  for (let i = 0; i < tileCount; i++) {
    tiles[i] = 0
  }
  const chunk = {
    x,
    y,
    width: chunkSize,
    height: chunkSize,
    data: tiles
  }
  return chunk
}

module.exports = parseBlocks

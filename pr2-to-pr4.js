/**
 * Convert PR2 level file into a Tiled compatible format
 */

const axios = require('axios')
const queryString = require('query-string')
const url = 'https://pr2hub.com/levels'

/**
 * split string, crease an empty array if the string is falsy
 */
const safeSplit = (str, delimiter = ',') => {
  return str ? str.split(delimiter) : []
}

/**
 * split up the data block into easier to digest sections
 */
const parsePr2Data = (str) => {
  const mainSections = str.split('`')
  const [
    fileVersion,
    fadeColor,
    blocks,
    art1,
    art2,
    art3,
    art4,
    u1,
    u2,
    bg
  ] = mainSections

  return {
    fileVersion,
    fadeColor,
    blocks: safeSplit(blocks),
    art1: safeSplit(art1),
    art2: safeSplit(art2),
    art3: safeSplit(art3),
    art4: safeSplit(art4),
    u1: safeSplit(u1),
    u2: safeSplit(u2),
    bg
  }
}

/**
 * Form a list of allowed itmes
 */
const parsePr2Items = (str) => {
  if (!str) return []
  const items = str.split('`')
  const hashLen = 32

  const lastItem = items[items.length - 1]
  if (lastItem.length > hashLen) {
    items[items.length - 1] = lastItem.substr(0, lastItem.length - hashLen)
  }

  return items
}

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
const parseBlocks = (blockArr, chunkSize = 16) => {
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
  return Object.values(chunkDict)
}

/**
 * Converts pr2's line drawings into a Tiled object layer
 */
const parseArt = (artArr) => {
  let color = '000000'
  let thickness = 1
  const objects = []

  artArr.forEach(command => {
    const type = command.substr(0, 1)
    const content = command.substr(1)
    if (type === 'c') {
      color = content
    }
    if (type === 't') {
      thickness = Number(content)
    }
    if (type === 'd') {
      objects.push(parseLine(content, color, thickness))
    }
  })

  return {
    draworder: 'topdown',
    name: 'Line Layer',
    objects,
    offsetx: 0,
    offsety: 0,
    opacity: 1,
    type: 'objectgroup',
    visible: true
  }
}

/**
 * Converts pr2's line format into an array of x, y coordinates
 */
const parseLine = (lineStr, color, thickness) => {
  const values = lineStr.split(';')
  const polyline = []
  let x = 0
  let y = 0
  let startX = 0
  let startY = 0
  let len = values.length / 2

  for (let i = 0; i < len; i += 2) {
    let valueX = Number(values[i])
    let valueY = Number(values[i + 1])
    if (i === 0) {
      startX = valueX
      startY = valueY
      polyline.push({ x: 0, y: 0 })
      continue
    }
    x += valueX
    y += valueY
    polyline.push({ x, y })
  }

  return {
    x: startX,
    y: startY,
    polyline,
    properties: {
      color,
      thickness
    }
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
    tilesets: [{
      columns: 10,
      firstgid: 1,
      image: 'pr2-blocks.png',
      imageheight: 120,
      imagewidth: 300,
      margin: 0,
      name: 'pr2-blocks',
      spacing: 0,
      tilecount: 40,
      tileheight: 30,
      tilewidth: 30
    }]
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
    parsed.data = parsePr2Data(parsed.data)
    const { blocks, items, art1, art2, art3, art4 } = parsed.data
    parsed.items = parsePr2Items(items)
    parsed.data.blocks = parseBlocks(blocks)
    parsed.artLayers = [art1, art2, art3, art4].map(parseArt)
    const tiled = toTiled(parsed)
    return { statusCode: 200, body: JSON.stringify(tiled) }
  } catch (e) {
    const statusCode = e.message.indexOf('404') >= 0 ? 404 : 500
    return { statusCode, body: JSON.stringify({error: e.message}) }
  }
}

/**
 * Workaround, serverless doesn't support promises
 * when using 'sls invoke local'
 * https://github.com/serverless/serverless/issues/4911
 */
module.exports.cbHandler = (event, ctx, callback) => {
  module.exports.handler(event)
    .then(result => callback(null, result))
    .catch(err => callback(err))
}

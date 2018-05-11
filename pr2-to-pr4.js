/**
 * Convert PR2 level file into a Tiled compatible format
 */

const axios = require('axios')
const queryString = require('query-string')
const url = 'https://pr2hub.com/levels'

const split = (str) => {
  if (!str) return []
  return str.split(',')
}

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
    blocks: split(blocks),
    art1: split(art1),
    art2: split(art2),
    art3: split(art3),
    art4: split(art4),
    u1: split(u1),
    u2: split(u2),
    bg
  }
}

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

const toTiled = (parsed) => {
  return {
    backgroundcolor: '#FFFFFF',
    infinite: true,
    layers: [
      {
        data: parsed.blocks,
        name: 'blocks',
        opacity: 1,
        properties: {
          depth: 1
        }
      }
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
    tileset: {
      columns: 5,
      firstgid: 1,
      image: 'pr2-tiles.png',
      imageheight: 480,
      imagewidth: 640,
      margin: 3,
      name: 'pr2-tiles',
      spacing: 1,
      tilecount: 266,
      tileheight: 32,
      tilewidth: 32
    }
  }
}

module.exports.handler = async (event) => {
  try {
    const levelId = event.queryStringParameters.levelId
    const levelUrl = `${url}/${levelId}.txt`
    const result = await axios.get(levelUrl)
    const parsed = queryString.parse(result.data)
    parsed.data = parsePr2Data(parsed.data)
    parsed.items = parsePr2Items(parsed.items)
    const tiled = toTiled(parsed)
    return { statusCode: 200, body: JSON.stringify(tiled) }
  } catch (e) {
    if (e.message === 'Request failed with status code 404') {
      return { statusCode: 404, body: e.message }
    }
    return { statusCode: 500, body: e.message }
  }
}

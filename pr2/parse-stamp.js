const stampTileset = require('./tilesets/stamps')

const scaleFactor = 0.450160772
let x = 0
let y = 0
let stampId = '0'

module.exports = (command) => {
  const segs = command.split(';')

  // fix for when the data is [shiftX, shiftY, scaleX, scaleY]
  if (segs.length === 4) {
    segs.splice(2, 0, stampId)
  }

  const [shiftX, shiftY, nextStampId = '', scaleX = 100, scaleY = 100] = segs
  stampId = nextStampId || stampId
  const gid = stampTileset.firstgid + Number(stampId)
  const stampData = stampTileset.tiles[stampId]
  const width = Number(scaleX) * stampData.imageheight * 0.01 * scaleFactor
  const height = Number(scaleY) * stampData.imagewidth * 0.01 * scaleFactor
  x += Number(shiftX)
  y += Number(shiftY)
  return { gid, x, y, width, height }
}

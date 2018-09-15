const stampTileset = require('./tilesets/stamps')

let x = 0
let y = 0

module.exports = (command) => {
  const [shiftX, shiftY, origStampId, scaleX = 100, scaleY = 100] = command.split(';')
  const id = Number(origStampId)
  const gid = stampTileset.firstgid + id
  const stampData = stampTileset.tiles[id]
  const width = Number(scaleX) * stampData.imageheight / 100
  const height = Number(scaleY) * stampData.imagewidth / 100
  x += Number(shiftX)
  y += Number(shiftY)
  return { gid, x, y, width, height }
}

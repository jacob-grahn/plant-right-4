const counter = require('./counter')
const stampTileset = require('./tilesets/stamps')

export const parseStamp = (command) => {
  const [x, y, origStampId, scaleX = 100, scaleY = 100] = command.split(';')
  const gid = 's' + origStampId
  const id = counter()
  const stampData = stampTileset.tiles[gid]
  const width = scaleX * stampData.imageheight
  const height = scaleY * stampData.imagewidth
  return { id, gid, x, y, width, height }
}

const BigRender = require('big-render')
const { createCanvas } = require('canvas')
const toHash = require('./to-hash')
const stashFile = require('./stash-file')
const { renderSize } = require('./settings')
const imageWidth = renderSize
const imageHeight = renderSize
const emptyHash = toHash(createCanvas(imageWidth, imageHeight).toBuffer('image/png'))

const renderLines = async (levelId, lines) => {
  const bounds = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity
  }
  let bigCtx = new BigRender()

  if (lines.length === 0) return []

  lines.forEach(line => {
    if (line.x > bounds.maxX) bounds.maxX = line.x
    if (line.x < bounds.minX) bounds.minX = line.x
    if (line.y > bounds.maxY) bounds.maxY = line.y
    if (line.y < bounds.minY) bounds.minY = line.y

    drawLine(line, bigCtx)
  })

  const imageMetadataList = await renderImages(levelId, bigCtx, bounds)
  return imageMetadataList
}

const drawLine = (line, ctx) => {
  ctx.beginPath()
  ctx.moveTo(line.x, line.y)
  ctx.strokeStyle = '#' + line.properties.color
  ctx.lineWidth = line.properties.width
  line.polyline.forEach(point => {
    let x = line.x + point.x
    let y = line.y + point.y
    ctx.lineTo(x, y)
  })
  ctx.stroke()
}

const renderImages = async (levelId, big, bounds) => {
  const canvas = createCanvas()
  const ctx = canvas.getContext('2d')
  const imageMetadataList = []
  canvas.width = imageWidth
  canvas.height = imageHeight

  let startX = Math.floor(bounds.minX / imageWidth) * imageWidth
  let startY = Math.floor(bounds.minY / imageHeight) * imageHeight
  for (let x = startX; x < bounds.maxX; x += imageWidth) {
    for (let y = startY; y < bounds.maxY; y += imageHeight) {
      big.render(ctx, x, y)
      const image = canvas.toBuffer('image/png')
      const hash = toHash(image)
      const key = `${hash}.png`
      if (hash !== emptyHash) {
        await stashFile(`pr2/levels/${levelId}/${key}`, image)
        imageMetadataList.push({
          x,
          y,
          width: imageWidth,
          height: imageHeight,
          key
        })
      }
      clearCtx(ctx)
    }
  }

  return imageMetadataList
}

const clearCtx = (ctx) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

module.exports = renderLines

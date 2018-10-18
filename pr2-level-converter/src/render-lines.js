const BigRender = require('big-render')
const { createCanvas } = require('canvas')
const path = require('path')
const tileWidth = 500
const tileHeight = 500

const renderLines = async (lines) => {
  const bounds = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity
  }
  let bigCtx = new BigRender()

  if (lines.length === 0) return

  lines.forEach(line => {
    if (line.x > bounds.maxX) bounds.maxX = line.x
    if (line.x < bounds.minX) bounds.minX = line.x
    if (line.y > bounds.maxY) bounds.maxY = line.y
    if (line.y < bounds.minY) bounds.minY = line.y

    renderLine(line, bigCtx)
  })

  await renderImages(bigCtx, bounds)
}

const renderLine = (line, ctx) => {
  ctx.beginPath()
  ctx.moveTo(line.x, line.y)
  ctx.strokeStyle = '#' + line.properties.color
  ctx.lineWidth = line.properties.width
  let x = line.x
  let y = line.y
  line.polyline.forEach(point => {
    x = line.x + point.x
    y = line.y + point.y
    ctx.lineTo(x, y)
  })
  ctx.stroke()
}

const renderImages = async (big, bounds) => {
  const canvas = createCanvas()
  canvas.width = tileWidth
  canvas.height = tileHeight
  const ctx = canvas.getContext('2d')

  let startX = Math.floor(bounds.minX / tileWidth) * tileWidth
  let startY = Math.floor(bounds.minY / tileHeight) * tileHeight
  for (let x = startX; x < bounds.maxX; x += tileWidth) {
    for (let y = startY; y < bounds.maxY; y += tileHeight) {
      big.render(ctx, x, y)
      await toPng(canvas, x, y)
      console.log('rendered', x, y)
      clearCtx(ctx)
    }
  }
}

const toPng = (canvas, x, y) => {
  return new Promise((resolve, reject) => {
    const fs = require('fs')
    const out = fs.createWriteStream(path.join(__dirname, `tile_${x}-${y}.png`))
    const stream = canvas.createPNGStream()
    stream.pipe(out)
    out.on('finish', resolve)
    out.on('error', reject)
  })
}

const clearCtx = (ctx) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

module.exports = renderLines

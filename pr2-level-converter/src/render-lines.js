const BigRender = require('big-render')
const { createCanvas } = require('canvas')
const imageWidth = 512
const imageHeight = 512

const renderLines = (lines) => {
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

    drawLine(line, bigCtx)
  })

  return renderImages(bigCtx, bounds)
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

const renderImages = (big, bounds) => {
  const canvas = createCanvas()
  const ctx = canvas.getContext('2d')
  const images = []
  canvas.width = imageWidth
  canvas.height = imageHeight

  let startX = Math.floor(bounds.minX / imageWidth) * imageWidth
  let startY = Math.floor(bounds.minY / imageHeight) * imageHeight
  for (let x = startX; x < bounds.maxX; x += imageWidth) {
    for (let y = startY; y < bounds.maxY; y += imageHeight) {
      big.render(ctx, x, y)
      const buffer = canvas.toBuffer('image/png')
      images.push({ x, y, buffer })
      clearCtx(ctx)
    }
  }

  return images
}

const clearCtx = (ctx) => {
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

module.exports = renderLines

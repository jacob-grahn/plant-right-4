const renderLines = (lines) => {
  lines.forEach(line => {
    renderLine(line, ctx)
  })
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

module.exports = renderLines

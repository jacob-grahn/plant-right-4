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
  let len = values.length

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

module.exports = parseLine

/**
 * Converts pr2's line format into an array of x, y coordinates
 */
const parseLine = (lineStr, color, thickness, mode) => {
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
      color: rightPad(color),
      thickness,
      mode
    }
  }
}

/**
 * Add characters to the end of a string up to the desired length
 * @param {string} str
 * @param {string} pad
 * @param {number} len
 */
const rightPad = (str = '', pad = '0', len = 6) => {
  while (str.length < len) {
    str = str + pad
  }
  return str
}

module.exports = parseLine

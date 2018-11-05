/* global test, expect */
const parseLine = require('./parse-line')

test('parse line', () => {
  const lineStr = '30;27;12;15'
  const color = 'FFFFFF'
  const thickness = 5
  const result = parseLine(lineStr, color, thickness)
  expect(result).toEqual({
    x: 30,
    y: 27,
    polyline: [
      { x: 0, y: 0 },
      { x: 12, y: 15 }
    ],
    properties: {
      color,
      thickness
    }
  })
})

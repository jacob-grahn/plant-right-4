/* global test, expect */

const renderLines = require('./render-lines')

test('draw a line to the filesystem', () => {
  const lines = [{
    x: 5,
    y: 5,
    properties: { color: '#947325', width: 10 },
    polyline: [
      { x: 10, y: 10 },
      { x: 15, y: 25 }
    ]
  }]
  renderLines(lines)
  expect(true).toBe(false)
})

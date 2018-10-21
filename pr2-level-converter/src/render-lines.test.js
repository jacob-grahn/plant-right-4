/* global test, expect */

const renderLines = require('./render-lines')
const { createCanvas } = require('canvas')

test('draw a line to the filesystem', () => {
  // known good
  const canvas = createCanvas()
  const ctx = canvas.getContext('2d')
  canvas.width = 500
  canvas.height = 500
  ctx.strokeStyle = '#947325'
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.moveTo(5, 5)
  ctx.lineTo(405, 105)
  ctx.lineTo(20, 455)
  ctx.stroke()
  const buffer = canvas.toBuffer('image/png')

  // hopefuly good
  const lines = [{
    x: 5,
    y: 5,
    properties: { color: '947325', width: 10 },
    polyline: [
      { x: 400, y: 100 },
      { x: 15, y: 450 }
    ]
  }]
  const imageMap = renderLines(lines)

  //
  expect(imageMap).toEqual({ '0-0': buffer })
})

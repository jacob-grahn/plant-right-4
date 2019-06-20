/* global test, expect, jest */

const renderLines = require('./render-lines')
const { createCanvas } = require('canvas')
const stashFile = require('./stash-file')
jest.mock('./stash-file')

test('render a line, and save the image', async () => {
  // known good
  const levelId = 123
  const canvas = createCanvas()
  const ctx = canvas.getContext('2d')
  canvas.width = 512
  canvas.height = 512
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
  const imageMatadataList = await renderLines(levelId, lines)

  //
  const key = '34707f30dbf66b5f8e9da895825db9fe.png'
  expect(imageMatadataList).toEqual([{
    key,
    x: 0,
    y: 0,
    width: 512,
    height: 512
  }])
  expect(stashFile.lastCallParams).toEqual({ buffer, key: `pr2/levels/123/${key}` })
})

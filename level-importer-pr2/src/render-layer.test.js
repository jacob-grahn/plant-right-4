/* global test, expect, jest */

const renderLayer = require('./render-layer')

jest.mock('./stash-file')

test('convert lines to pre-rendered stamps', async () => {
  const levelId = 1
  const layer = {
    objects: [
      {
        x: 20,
        y: 30,
        properties: { color: 'ABCDEF', width: 5 },
        polyline: [
          { x: 10, y: -10 },
          { x: 20, y: 30 }
        ]
      }
    ]
  }
  const newLayer = await renderLayer(levelId, layer)
  expect(newLayer.objects[0]).toEqual({
    gid: 'pr2/1/68a5cdf36daaad4339aa444c0ecea58f.png',
    height: 512,
    width: 512,
    x: 0,
    y: 0
  })
})

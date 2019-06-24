/* global test, expect, jest */

const renderLayer = require('./render-layer')
const { renderSize } = require('./settings')

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
  const lastgid = 7
  const { renderedLayer, tileset } = await renderLayer(levelId, layer, lastgid)
  expect(renderedLayer.objects[0]).toEqual({
    gid: 7,
    height: renderSize,
    width: renderSize,
    x: 0,
    y: renderSize
  })
  expect(tileset.tilecount).toBe(1)
  expect(tileset.tiles['0']).toEqual({
    image: '8fdf34f0458f924f685ba0c448a971b7.png',
    imageheight: renderSize,
    imagewidth: renderSize
  }
  )
})

/* global test, expect, jest */

const renderLevel = require('./render-level')

jest.mock('./stash-file')

test('pre-render art layers', async () => {
  const level = {
    layers: [
      { type: 'tiles', somevalue: 'yay' },
      { type: 'objectgroup',
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
        ] }
    ],
    tilesets: []
  }
  const levelId = 1
  const result = await renderLevel(levelId, level)

  expect(result.layers[0].type).toEqual('tiles')
  expect(result.layers[1].type).toEqual('objectgroup')
})

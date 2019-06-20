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
    ]
  }
  const levelId = 1
  const result = await renderLevel(levelId, level)

  expect(result.layers).toEqual([
    { type: 'tiles', somevalue: 'yay' },
    {
      type: 'objectgroup',
      objects: [{
        gid: '68a5cdf36daaad4339aa444c0ecea58f.png',
        height: 512,
        width: 512,
        x: 0,
        y: 0
      }]
    }
  ])
})

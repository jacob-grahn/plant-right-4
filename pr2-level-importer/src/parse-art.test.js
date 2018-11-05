/* global test, expect */

const parseArt = require('./parse-art')

test('parse art', () => {
  const artArr = [
    'd10155;10082;0;-7;0;-13'
  ]

  const result = parseArt(artArr)
  expect(result.objects).toEqual([{
    x: 10155,
    y: 10082,
    polyline: [
      { x: 0, y: 0 },
      { x: 0, y: -7 },
      { x: 0, y: -20 }
    ],
    properties: {
      color: '000000',
      thickness: 1
    }
  }])
})

/* global test, expect */
const pr2ToPr4 = require('./pr2-to-pr4')

test('include pr2 blaock and stamp tileset', () => {
  const result = pr2ToPr4({})
  expect(result.tilesets.length).toBe(2)
})

test('include gravity, song, and items in level properties', () => {
  const result = pr2ToPr4({ items: 'boat`plane', song: '1', gravity: '0.8' })
  const properties = result.properties
  expect(properties.items).toEqual(['boat', 'plane'])
  expect(properties.song).toBe(1)
  expect(properties.gravity).toBe(0.8)
})

test('create layers', () => {
  const result = pr2ToPr4({ artLayers: [['d123']] })
  expect(result.layers[0].type).toBe('tilelayer')
  expect(result.layers[1].type).toBe('objectgroup')
})

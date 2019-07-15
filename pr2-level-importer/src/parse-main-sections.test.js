/* global test, expect */

const parseMainSections = require('./parse-main-sections')

test('parse main section', () => {
  const arr = [
    'fileVersion',
    'fadeColor',
    'blocks',
    'art1',
    'art2',
    'art3',
    'art4',
    'u1',
    'u2',
    'bg'
  ]
  const str = arr.join('`')

  expect(parseMainSections(str)).toEqual({
    fileVersion: 'fileVersion',
    fadeColor: 'fadeColor',
    blocks: ['blocks'],
    art1: ['art1'],
    art2: ['art2'],
    art3: ['art3'],
    art4: ['art4'],
    u1: ['u1'],
    u2: ['u2'],
    bg: 'bg'
  })
})

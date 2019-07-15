/* global test, expect */
const fs = require('fs')
const path = require('path')
const parsePr2Level = require('./parse-pr2-level')

test('parse a pr2 level into sections', () => {
  const filepath = path.join(__dirname, '__tests__/50815.txt')
  const pr2Level = fs.readFileSync(filepath, 'utf8')
  const data = parsePr2Level(pr2Level)
  expect(Object.keys(data)).toEqual([
    'credits',
    'gameMode',
    'gravity',
    'has_pass',
    'items',
    'level_id',
    'live',
    'max_time',
    'min_level',
    'note',
    'song',
    'time',
    'title',
    'user_id',
    'version',
    'fileVersion',
    'fadeColor',
    'blocks',
    'u1',
    'u2',
    'bg',
    'artLayers'
  ])
})

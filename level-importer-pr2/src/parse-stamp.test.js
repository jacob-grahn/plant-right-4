const parseStamp = require('./parse-stamp')

test('convert stamp id to tileset gid', () => {
    const result = parseStamp('0;0;5')
    expect(result.gid).toBe(46)
})

test('remeber last stamp', () => {
    const result = parseStamp('100;50')
    expect(result.gid).toBe(46)
})

test('remeber relative position', () => {
    const result = parseStamp('0;0')
    expect(result.x).toBe(100)
})

test('handle missing stamp id', () => {
    const result = parseStamp('0;0;200;200')
    expect(result.gid).toBe(46)
})
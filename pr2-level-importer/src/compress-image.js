const fs = require('fs')
const { execFile } = require('child_process')
const { promisify } = require('util')
const execFilePromise = promisify(execFile)
let i = 1

/**
 * Convert png into lossy-alpha webp
 * @param {Buffer} imageBuffer
 */
const compressImage = async (imageBuffer) => {
  const src = `/tmp/${i}.png`
  const out = `/tmp/${i}.webp`
  i++
  fs.writeFileSync(src, imageBuffer)
  await execFilePromise('cwebp', [
    src,
    '-q', '90',
    '-alpha_q', '100',
    '-m', '4', // 0-6, 0 is the fastest, 6 is the best quality
    '-o', out
  ])
  const compressedBuffer = fs.readFileSync(out)
  return compressedBuffer
}

module.exports = compressImage

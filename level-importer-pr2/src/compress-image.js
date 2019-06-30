const fs = require('fs')
const { execFile } = require('child_process')
const { promisify } = require('util')
const cwebp = require('cwebp-bin')
const execFilePromise = promisify(execFile)

/**
 * Convert png into lossy-alpha webp
 * @param {Buffer} imageBuffer 
 */
const compressImage = async (imageBuffer) => {
    const src = '/tmp/img.png'
    const out = '/tmp/img.webp'
    fs.writeFileSync(src, imageBuffer)
    await execFilePromise(cwebp, [
        src, 
        '-q', '90',
        '-alpha_q', '100', 
        '-m', '6', 
        '-o', out
    ])
    const compressedBuffer = fs.readFileSync(out)
    fs.unlinkSync(src)
    fs.unlinkSync(out)
    return compressedBuffer
}

module.exports = compressImage
const crypto = require('crypto')

const toHash = (value) => {
  const hash = crypto.createHash('md5')
  hash.update(value)
  return hash.digest('hex')
}

module.exports = toHash

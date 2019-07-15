const stashFile = (key, buffer) => {
  stashFile.lastCallParams = { key, buffer }
  return Promise.resolve()
}

module.exports = stashFile

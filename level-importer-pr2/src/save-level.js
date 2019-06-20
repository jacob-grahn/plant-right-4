const stashFile = require('./stash-file')

const saveLevel = (levelId, pr4Level) => {
  const path = `pr2/levels/${levelId}/${levelId}.json`
  const strLevel = JSON.stringify(pr4Level)
  return stashFile(path, strLevel)
}

module.exports = saveLevel

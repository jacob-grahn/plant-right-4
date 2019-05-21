const stashFile = require('./stash-file')

const saveLevel = (levelId, pr4Level) => {
  stashFile(`pr2/${levelId}/${levelId}.json`, pr4Level)
}

module.exports = saveLevel

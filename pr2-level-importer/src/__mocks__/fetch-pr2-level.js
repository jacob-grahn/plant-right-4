const fs = require('fs')
const path = require('path')

const fetchPr2Level = async (levelId) => {
  const filepath = path.join(__dirname, `../__tests__/${levelId}.txt`)
  const pr2Level = fs.readFileSync(filepath, 'utf8')
  return pr2Level
}

module.exports = fetchPr2Level

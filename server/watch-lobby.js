const pickLevel = require('./pick-level')
const loadLevel = require('./load-level')

const start = () => {
  setInterval(async () => {
    const levelId = await pickLevel()
    const level = await loadLevel(levelId)
    console.log(level)
  }, 5000)
}

module.exports = {
  start
}

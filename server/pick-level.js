// pick a random level from the db

const axios = require('axios')
const url = 'https://pr2hub.com/random_level.php'

module.exports = async () => {
  const result = await axios.get(url)
  const levels = result.data
  const level = levels[0]
  return level.level_id
}

const axios = require('axios')
const url = 'https://pr2hub.com/levels'

const fetchPr2Level = async (levelId) => {
  const levelUrl = `${url}/${levelId}.txt`
  const result = await axios.get(levelUrl)
  return result.data
}

module.exports = fetchPr2Level

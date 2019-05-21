const axios = require('axios')
const queryString = require('query-string')
const parsePr2Data = require('./parse-pr2-data')
const parsePr2Items = require('./parse-pr2-items')
const url = 'https://pr2hub.com/levels'

module.exports = async (levelId) => {
  const levelUrl = `${url}/${levelId}.txt`
  const result = await axios.get(levelUrl)
  const parsed = queryString.parse(result.data)
  const chunk = parsePr2Data(parsed.data)
  parsed.items = parsePr2Items(parsed.items)
  delete parsed.data
  return {...chunk, ...parsed}
}

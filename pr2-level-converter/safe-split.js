/**
 * split string, crease an empty array if the string is falsy
 */
const safeSplit = (str, delimiter = ',') => {
  return str ? str.split(delimiter) : []
}

module.exports = safeSplit

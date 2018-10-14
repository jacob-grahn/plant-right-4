/**
 * Form a list of allowed itmes
 */
const parseItems = (str) => {
  if (!str) return []
  const items = str.split('`')
  const hashLen = 32

  const lastItem = items[items.length - 1]
  if (lastItem.length > hashLen) {
    items[items.length - 1] = lastItem.substr(0, lastItem.length - hashLen)
  }

  return items
}

module.exports = parseItems

const safeSplit = require('./safe-split')

/**
 * split up the data block into easier to digest sections
 */
const parseMainSections = (str) => {
  // file version = m3
  const mainSections = str.split('`')
  const [
    fileVersion,
    fadeColor,
    blocks,
    art1,
    art2,
    art3,
    art4,
    art0,
    art00,
    bg
  ] = mainSections

  return {
    fileVersion,
    fadeColor,
    blocks: safeSplit(blocks),
    art1: safeSplit(art1),
    art2: safeSplit(art2),
    art3: safeSplit(art3),
    art4: safeSplit(art4),
    art0: safeSplit(art0),
    art00: safeSplit(art00),
    bg
  }
}

module.exports = parseMainSections

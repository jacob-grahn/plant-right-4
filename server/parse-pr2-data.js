const split = (str) => {
  if (!str) return []
  return str.split(',')
}

module.exports = (str) => {
  const mainSections = str.split('`')
  const [
    fileVersion,
    fadeColor,
    blocks,
    art1,
    art2,
    art3,
    art4,
    u1,
    u2,
    bg
  ] = mainSections

  return {
    fileVersion,
    fadeColor,
    blocks: split(blocks),
    art1: split(art1),
    art2: split(art2),
    art3: split(art3),
    art4: split(art4),
    u1: split(u1),
    u2: split(u2),
    bg
  }
}

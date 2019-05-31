module.exports = {
  columns: 10,
  firstgid: 1,
  image: 'pr2/blocks.png',
  imageheight: 120,
  imagewidth: 300,
  margin: 0,
  name: 'pr2-blocks',
  spacing: 0,
  tilecount: 40,
  tileheight: 30,
  tilewidth: 30,

  tileproperties: {
    "0": {
      collides: true
    },
    "1": {
      collides: true
    },
    "10": {
      bumpHandlers: "item",
      collides: true
    },
    "11": {
      collides: false,
      startpos: true
    },
    "12": {
        "collides":false,
        "startpos":true
    },
    "13": {
        "collides":false,
        "startpos":true
    },
    "14": {
        "collides":false,
        "startpos":true
    },
    "15": {
        collides: true,
        "standHandlers":"ice"
    },
    "16": {
        "bumpHandlers":"finish",
        collides: true
    },
    "17": {
        "collideHandlers":"crumble",
        collides: true
    },
    "18": {
        "collideHandlers":"vanish",
        collides: true
    },
    "19": {
        collides: true
    },
    "2": {
        collides: true
    },
    "20": {
        "collides":false,
        "overlapHandlers":"water"
    },
    "21": {
        "bumpHandlers":"rotateClockwise",
        collides: true
    },
    "22": {
        "bumpHandlers":"rotateCounterclockwise",
        collides: true
    },
    "23": {
        "collideHandlers":"push",
        collides: true
    },
    "24": {
        "collideHandlers":"safetyNet",
        collides: true
    },
    "25": {
        "bumpHandlers":"infiniteItem",
        collides: true
    },
    "26": {
        "bumpHandlers":"happy",
        collides: true
    },
    "27": {
        "bumpHandlers":"sad",
        collides: true
    },
    "28": {
        "bumpHandlers":"heal",
        collides: true
    },
    "29": {
        "bumpHandlers":"time",
        collides: true
    },
    "3": {
        collides: true
    },
    "30": {
        collides: false,
        spawn: "egg"
    },
    "4": {
        "bumpHandlers":"brick",
        collides: true
    },
    "5": {
        "collideHandlers":"down",
        collides: true
    },
    "6": {
        "collideHandlers":"up",
        collides: true
    },
    "7": {
        "collideHandlers":"left",
        collides: true
    },
    "8": {
        "collideHandlers":"right",
        collides: true
    },
    "9": {
        "collideHandlers":"mine",
        collides: true
    }
  },

  tilepropertytypes: {
    "0":
    {
        "collides":"bool"
    },
    "1":
    {
        "collides":"bool"
    },
    "10":
    {
        "bumpHandlers":"string",
        "collides":"bool"
    },
    "11":
    {
        "collides":"bool",
        "startpos":"bool"
    },
    "12":
    {
        "collides":"bool",
        "startpos":"bool"
    },
    "13":
    {
        "collides":"bool",
        "startpos":"bool"
    },
    "14":
    {
        "collides":"bool",
        "startpos":"bool"
    },
    "15":
    {
        "collides":"bool",
        "standHandlers":"string"
    },
    "16":
    {
        "bumpHandlers":"string",
        "collides":"bool"
    },
    "17":
    {
        "collideHandlers":"string",
        "collides":"bool"
    },
    "18":
    {
        "collideHandlers":"string",
        "collides":"bool"
    },
    "19":
    {
        "collides":"bool"
    },
    "2":
    {
        "collides":"bool"
    },
    "20":
    {
        "collides":"bool",
        "overlapHandlers":"string"
    },
    "21":
    {
        "bumpHandlers":"string",
        "collides":"bool"
    },
    "22":
    {
        "bumpHandlers":"string",
        "collides":"bool"
    },
    "23":
    {
        "collideHandlers":"string",
        "collides":"bool"
    },
    "24":
    {
        "collideHandlers":"string",
        "collides":"bool"
    },
    "25":
    {
        "bumpHandlers":"string",
        "collides":"bool"
    },
    "26":
    {
        "bumpHandlers":"string",
        "collides":"bool"
    },
    "27":
    {
        "bumpHandlers":"string",
        "collides":"bool"
    },
    "28":
    {
        "bumpHandlers":"string",
        "collides":"bool"
    },
    "29":
    {
        "bumpHandlers":"string",
        "collides":"bool"
    },
    "3":
    {
        "collides":"bool"
    },
    "30":
    {
        "collides":"bool",
        "spawn":"string"
    },
    "4":
    {
        "bumpHandlers":"string",
        "collides":"bool"
    },
    "5":
    {
        "collideHandlers":"string",
        "collides":"bool"
    },
    "6":
    {
        "collideHandlers":"string",
        "collides":"bool"
    },
    "7":
    {
        "collideHandlers":"string",
        "collides":"bool"
    },
    "8":
    {
        "collideHandlers":"string",
        "collides":"bool"
    },
    "9":
    {
        "collideHandlers":"string",
        "collides":"bool"
    }
}

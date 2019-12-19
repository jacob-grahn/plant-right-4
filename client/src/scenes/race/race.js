import { Player } from '../../player/player'
import { tileEffects, tileOverlap } from '../../tile-effects'
import { buildBG } from './build-bg'

let physics
let sceneInstance
let player
let tileLayer
let particleList = []
export let deltaTime

let sides = [
    'down',
    'left',
    'up',
    'right'
]

function updateParticles (item, index) {
  item.update()
}

function findStartPositions (tileIndexes, tileLayer) {
  const startPositions = []
  tileIndexes.forEach(tileIndex => {
    const tile = tileLayer.findByIndex(tileIndex)
    if (tile) {
      startPositions.push({ x: tile.pixelX + 15, y: tile.pixelY + 15 })
    }
  })
  return startPositions
}

function findStartTileIndexes (tileMap) {
  const tileIndexes = []
  tileMap.tilesets.forEach(tileset => {
    if (tileset.name === 'blocks') {
      Object.keys(tileset.tileProperties).forEach(tileIndex => {
        const tilePropertyObj = tileset.tileProperties[tileIndex]
        if (tilePropertyObj.startpos) {
          tileIndexes.push(Number(tileIndex) + 1)
        }
      })
    }
  })
  return tileIndexes
}

export function GetScene () {
  return sceneInstance
}

export function AddParticle (particle) {
  particleList.push(particle)
}

export function RemoveParticle (particle) {
  // Used for particle system I started, will probably move to main.js
  var index = particleList.indexOf(particle)
  if (index > -1) {
    particleList.splice(index, 1)
  }
}

export function BlockedSide (side) {
  return player.body.blocked[rotateSide(side, player.sprite.angle)]
}

export function TileOverlapping (sprite) {
  physics.overlapTiles(sprite, tileLayer.culledTiles, tileOverlap)
}

function rotateSide (side, angle) {
  const sideIndex = sides.indexOf(side)
  let i = 0

  if (angle > -45 && angle < 50) {
    i = 0
  } else if (angle >= 45 && angle <= 135) {
    i += 1
  } else if (angle > 135 || angle < -135) {
    i += 2
  } else {
    i += 3
  }
  return (sides[(sideIndex + i) % sides.length])
}

function getLevelId () {
    const url = window.location.href
    const dirs = url.replace('?', '').split('/')
    if (dirs.length >= 2 && dirs[dirs.length - 2] === 'level') {
        return dirs[dirs.length - 1]
    }
    return undefined
}

export class Race extends Phaser.Scene {

    constructor () {
        super({
            key: 'Race',
            pack: {
                files: [{
                    type: 'scenePlugin', 
                    key: 'SpinePlugin', 
                    url: 'plugins/SpinePlugin.js', 
                    sceneKey: 'spine',
                    start: true
                }]
            }
        })
    }

    preload () {
        const levelId = getLevelId() || 50815 // 3480351
        this.load.tilemapTiledJSON('map', `https://dev-levels.platformracing.com/pr2/levels/${levelId}/${levelId}.json`)
        // Used for shatter particle effect
        this.load.spritesheet(
            'blocksSH',
            'assets/images/pr2-blocks.png',
            { frameWidth: 30, frameHeight: 30 }
        )
        this.load.image('blocks', 'assets/images/pr2-blocks.png')

        this.load.setPath('assets/sounds')
        this.load.audio('explodesfx', 'explosion.mp3')

        this.load.setPath('assets/animations/spine/')
        this.load.spine('PRFGuy', 'PRFGuy.json', 'PRFGuy.atlas')
        this.load.spine('Explosion', 'Explosion.json', 'Explosion.atlas')
    }

    create () {
        // physics
        physics = this.physics
        sceneInstance = this.scene.scene
        player = new Player(this, 0, 0)

        // map
        const map = this.make.tilemap({ key: 'map', tileWidth: 30, tileHeight: 30 })
        const tileset = map.addTilesetImage('blocks', 'blocks')
        tileLayer = map.createDynamicLayer('tilelayer', tileset, 0, 0)
        tileLayer.setCollisionByProperty({ collides: true })

        // start position
        const startTileIndexes = findStartTileIndexes(map)
        const startPositions = findStartPositions(startTileIndexes, tileLayer)
        if (startPositions.length > 0) {
            const startPosition = startPositions[0]
            console.log(startPosition)
            player.sprite.setPosition(startPosition.x, startPosition.y)
        }

        // camera
        this.cameras.main.startFollow(player.sprite)
        this.cameras.main.setLerp(0.1, 0.1)
        this.cameras.main.zoom = 1
        this.cameras.main.backgroundColor.setTo(100,200,255)

        // physics
        this.physics.add.collider(player, tileLayer, tileEffects)
        this.physics.world.bounds.width = tileLayer.width
        this.physics.world.bounds.height = tileLayer.height

        // load bg
        let rawMap = this.cache.tilemap.get('map').data
        buildBG(this, rawMap)
    }

    update (_time, delta) {
        // Set delta time for export variable to be accessed elsewhere(Should eventually multiply movement by this so that movement is framerate independent)
        deltaTime = delta
        const cursors = this.input.keyboard.createCursorKeys()
        cursors.rKey = this.input.keyboard.addKey(82) // r key -- used to test rotation during development
        player.update(cursors, delta)
        this.cameras.main.setAngle(-player.sprite.angle)
        particleList.forEach(updateParticles)
    }
}
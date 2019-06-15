import 'phaser'
import { Player } from './player'
import { tileEffects } from './tile-effects'
import { rotateVector } from './rotateVector.js'

const config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update,
        pack: {
            files: [
            {
                type: 'scenePlugin',
                key: 'SpineWebGLPlugin',
                url: 'plugins/SpineWebGLPlugin.js',
                start: true,
                sceneKey: 'spine'
            }]
        }
    }
};

const game = new Phaser.Game(config)
export let deltaTime
let tweener
let sceneInstance
let player
let tileLayer
//Used for particle system I started, will probably move to main.js
let particleList = []

let sides = [
    'down',
    'left',
    'up',
    'right'
]

function preload () {
    this.load.image('sky', 'assets/images/sky.png')
    this.load.image('ground', 'assets/images/platform.png')
    this.load.image('star', 'assets/images/star.png')
    this.load.image('bomb', 'assets/images/bomb.png')
    this.load.spritesheet(
        'dude', 
        'assets/images/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    )
    this.load.tilemapTiledJSON("map", "assets/tilemaps/50815.json")
    //Used for shatter particle effect
    this.load.spritesheet(
        'blocksSH', 
        'assets/images/pr2-blocks.png',
        { frameWidth: 30, frameHeight: 30 }
    )
    this.load.image('blocks', 'assets/images/pr2-blocks.png')
    this.load.setPath('assets/animations/spine/')

     this.load.spine('PRFGuy', 'PRFGuy.json', 'PRFGuy.atlas')
}

function create () {
    this.add.image(400, 300, 'sky')

    // tweens
    tweener = this.tweens

    sceneInstance = this.scene.scene

    // player
    player = new Player(this, 0, 0)

    // map
    const map = this.make.tilemap({ key: "map", tileWidth: 30, tileHeight: 30 })
    const tileset = map.addTilesetImage("blocks", "blocks")
    tileLayer = map.createDynamicLayer("Tile Layer", tileset, 0, 0)
    tileLayer.setCollisionByProperty({ collides: true })

    // start position
    const startTileIndexes = findStartTileIndexes(map)
    const startPositions = findStartPositions(startTileIndexes, tileLayer)
    if (startPositions.length > 0) {
        const startPosition = startPositions[0]
        player.sprite.setPosition(startPosition.x, startPosition.y)
    }

    // camera
    this.cameras.main.startFollow(player.sprite)
    this.cameras.main.setLerp(0.1, 0.1)
    this.cameras.main.zoom = 1.5

    // physics
    this.physics.add.collider(player.sprite, tileLayer, tileEffects)
    this.physics.world.bounds.width = tileLayer.width
    this.physics.world.bounds.height = tileLayer.height
}

function update (time, delta) {
    //Set delta time for export variable to be accessed elsewhere(Should eventually multiply movement by this so that movement is framerate independent)
    deltaTime = delta
    const cursors = this.input.keyboard.createCursorKeys()
    player.update(cursors)
    this.cameras.main.setAngle(-player.sprite.angle)

     particleList.forEach(updateParticles)
}

function updateParticles(item, index) {
    item.update()
}

function findStartPositions (tileIndexes, tileLayer) {
    const startPositions = []
    tileIndexes.forEach(tileIndex => {
        const tile = tileLayer.findByIndex(tileIndex)
        if (tile) {
            startPositions.push({ x: tile.pixelX, y: tile.pixelY })
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
                    tileIndexes.push(Number(tileIndex))
                }
            })
        }
    })
    return tileIndexes
}

export function CreateTween(config) {
    tweener.add(config)
}

export function GetScene() {
    return sceneInstance
}

export function IsTweenRunning() {
    return tweener._active.length > 0
}

export function AddParticle(particle) {
    particleList.push(particle)
}

export function RemoveParticle(particle) {
    //Used for particle system I started, will probably move to main.js
    var index = particleList.indexOf(particle);
    if (index > -1) {
      particleList.splice(index, 1);
    }
}

export function BlockedSide(side) {
    return player.sprite.body.blocked[rotateSide(side, player.sprite.angle)]
}


function rotateSide(side, angle) {
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
    return(sides[(sideIndex + i) % sides.length])
}
import 'phaser'
import { Player } from './player'
import { tileEffects } from './tile-effects'

const config = {
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
        update
    }
};

const game = new Phaser.Game(config)
let tweener
let player
let tileLayer

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
    this.load.image('blocks', 'assets/images/pr2-blocks.png')
}

function create () {
    tweener = this.tweens
    this.add.image(400, 300, 'sky')

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

    // physics
    this.physics.add.collider(player.sprite, tileLayer, tileEffects)
    this.physics.world.bounds.width = tileLayer.width
    this.physics.world.bounds.height = tileLayer.height
}

function update () {
    const cursors = this.input.keyboard.createCursorKeys()
    player.update(cursors)
    this.cameras.main.setAngle(-player.sprite.angle)
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
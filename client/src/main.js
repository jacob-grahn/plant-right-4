import 'phaser'
import { Player } from './player'

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
    this.load.image('pr2-blocks', 'assets/images/pr2-blocks.png')
}

function create () {
    this.add.image(400, 300, 'sky')

    // player
    player = new Player(this, 100, 450)

    // map
    const map = this.make.tilemap({ key: "map", tileWidth: 30, tileHeight: 30 })
    const tileset = map.addTilesetImage("pr2-blocks", "pr2-blocks")
    tileLayer = map.createDynamicLayer("Tile Layer", tileset, 0, 0)
    tileLayer.x = -3400
    tileLayer.y = -1000
    tileLayer.setCollisionByProperty({ collides: true })

    // camera
    this.cameras.main.startFollow(player.sprite)
    this.cameras.main.setLerp(0.1, 0.1)

    // physics
    this.physics.add.collider(player.sprite, tileLayer, tileCallback)
    this.physics.world.bounds.width = tileLayer.width
    this.physics.world.bounds.height = tileLayer.height
}

function tileCallback (playerSprite, tile) {
    if (tile.properties.collideHandlers) {
        const collideHandlers = tile.properties.collideHandlers.split(',')
        collideHandlers.forEach((handlerName) => {
            if (handlerName === 'right') {
                playerSprite.setVelocityX(300)
            }
        })
    }
}

function update () {
    const cursors = this.input.keyboard.createCursorKeys()
    player.update(cursors)
    this.cameras.main.setAngle(-player.sprite.angle)
}
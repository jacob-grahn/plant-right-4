import 'phaser'

const config = {
    parent: 'content',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
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
    player = this.physics.add.sprite(100, 450, 'dude')

    player.setBounce(0)
    player.body.setGravityY(300)

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    })

    // map
    const map = this.make.tilemap({ key: "map", tileWidth: 30, tileHeight: 30 })
    const tileset = map.addTilesetImage("pr2-blocks", "pr2-blocks")
    tileLayer = map.createDynamicLayer("Tile Layer", tileset, 0, 0)
    tileLayer.x = -1000
    tileLayer.y = -1000
    tileLayer.setCollisionBetween(1, 200, true, false)

    // camera
    this.cameras.main.startFollow(player)
    this.cameras.main.setLerp(0.1, 0.1)

    // physics
    this.physics.add.collider(player, tileLayer)
    this.physics.world.bounds.width = tileLayer.width
    this.physics.world.bounds.height = tileLayer.height
}

function update () {
    // player
    const cursors = this.input.keyboard.createCursorKeys()
    if (cursors.left.isDown) {
        player.setVelocityX(-160)
        player.anims.play('left', true)
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160)
        player.anims.play('right', true)
    }
    else {
        player.setVelocityX(0)
        player.anims.play('turn')
    }

    if (cursors.up.isDown && (player.body.onFloor() || player.body.touching.down)) {
        player.setVelocityY(-500)
    }
}
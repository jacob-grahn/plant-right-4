import { rotateVector } from './rotateVector'
import { PlayerAttributes } from './player-attributes'
import 'phaser'

export class Player {
    constructor (scene, x, y) {
        this.sprite = scene.physics.add.sprite(x, y, 'dude')
        this.sprite.body.gravity = { x: 0, y: 1000 }
        this.sprite.body.maxSpeed = 1000
        // this.sprite.body.useDamping = true
        // this.sprite.body.setDrag(0.95, 0.95)
        this.sprite.body.setSize(25, 25)
        this.canRotate = true
        this.sprite.externalAcceleration = { x: 0, y: 0 }
        this.attributes = new PlayerAttributes()

        console.log(this.attributes.velX, this.attributes.velX, this.attributes.ease)
        this.onRotate()

        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        })
    
        scene.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        })
    
        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        })
    }

    update (cursors) {
        const sprite = this.sprite
        const body = sprite.body
        const accel = new Phaser.Math.Vector2(0, 0)
        const rotatedVelocity = rotateVector({x: body.velocity.x, y: body.velocity.y}, -this.sprite.angle)
        
        if (cursors.left.isDown) {
            accel.x = (-this.attributes.velX - rotatedVelocity.x) * this.attributes.ease
            sprite.anims.play('left', true)
        }
        else if (cursors.right.isDown) {
            accel.x = (this.attributes.velX - rotatedVelocity.x) * this.attributes.ease
            sprite.anims.play('right', true)
        }
        else {
            accel.x = (0 - rotatedVelocity.x) * this.attributes.ease
            sprite.anims.play('turn')
        }

        if (cursors.up.isDown && sprite.body.blocked[this.dir]) {
            accel.y = -this.attributes.velY
        }

        if (cursors.down.isDown) {
            if (this.canRotate) {
                this.rotate(90)
                this.canRotate = false
            }
        } else {
            this.canRotate = true
        }

        const rotatedAccel = rotateVector(accel, this.sprite.angle)
        body.velocity.x += this.sprite.externalAcceleration.x + rotatedAccel.x
        body.velocity.y += this.sprite.externalAcceleration.y + rotatedAccel.y

        // limit speed so we can't run through blocks
        body.velocity.x = Phaser.Math.Clamp(body.velocity.x, -800, 800)
        body.velocity.y = Phaser.Math.Clamp(body.velocity.y, -800, 800)

        this.sprite.externalAcceleration.x = 0
        this.sprite.externalAcceleration.y = 0
    }

    rotate (degrees) {
        this.sprite.setAngle(this.sprite.angle + degrees)
        this.sprite.body.gravity = rotateVector(this.sprite.body.gravity, degrees)
        this.onRotate()
    }

    onRotate () {
        const angle = this.sprite.angle
        if (angle > -45 && angle < 45) {
            this.dir = 'down'
            this.sprite.body.setOffset(4, 23)
        } else if (angle >= 45 && angle <= 135) {
            this.dir = 'left'
            this.sprite.body.setOffset(-8, 10)
        } else if (angle > 135 || angle < -135) {
            this.dir = 'up'
            this.sprite.body.setOffset(4, 0)
        } else {
            this.dir = 'right'
            this.sprite.body.setOffset(15, 12)
        }
    }
}
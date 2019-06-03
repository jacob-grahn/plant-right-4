import { rotateVector } from './rotateVector'
import 'phaser'

export class Player {
    constructor (scene, x, y) {
        this.sprite = scene.physics.add.sprite(x, y, 'dude')
        this.sprite.body.gravity = { x: 0, y: 1000 }
        this.sprite.body.maxSpeed = 1000
        this.sprite.body.useDamping = true
        this.sprite.body.setDrag(0.95, 0.95)
        this.sprite.body.setSize(25, 25)
        this.canRotate = true
        this.sprite.externalAcceleration = { x: 0, y: 0 }

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
        var ang = sprite.angle * Math.PI / 180
        var trigVec = new Phaser.Math.Vector2(
            Math.round(Math.cos(ang)),
            Math.round(Math.sin(ang))
         )

        if (cursors.left.isDown) {
            accel.x = trigVec.x * -800
            accel.y = trigVec.y * -800
            sprite.anims.play('left', true)
        }
        else if (cursors.right.isDown) {
            accel.x = trigVec.x * 800
            accel.y = trigVec.y * 800
            sprite.anims.play('right', true)
        }
        else {
            sprite.anims.play('turn')
        }

        if (cursors.up.isDown && sprite.body.blocked[this.dir]) {
            accel.x = trigVec.y * 60000
            accel.y = trigVec.x * -60000
        }

        if (cursors.down.isDown) {
            if (this.canRotate) {
                this.rotate(90)
                this.canRotate = false
            }
        } else {
            this.canRotate = true
        }

        sprite.body.setAcceleration(
            this.sprite.externalAcceleration.x + accel.x,
             this.sprite.externalAcceleration.y + accel.y
             )

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
import { rotateVector } from './rotateVector'
import 'phaser'

export class Player {
    constructor (scene, x, y) {
        this.sprite = scene.physics.add.sprite(x, y, 'dude')
        this.sprite.body.gravity = { x: 0, y: 1000 }
        this.sprite.body.setDrag(600, 200)

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
        const accel = new Phaser.Math.Vector2(0, 0)
        
        if (cursors.left.isDown) {
            accel.x = -400
            sprite.anims.play('left', true)
        }
        else if (cursors.right.isDown) {
            accel.x = 400
            sprite.anims.play('right', true)
        }
        else {
            sprite.anims.play('turn')
        }

        if (cursors.up.isDown && (sprite.body.onFloor() || sprite.body.touching.down)) {
            accel.y = -30000
        }

        if (cursors.down.isDown) {
            this.rotate(90)
        }

        const rotatedAccel = rotateVector(accel, this.sprite.angle)

        // apply
        sprite.body.setAcceleration(rotatedAccel.x, rotatedAccel.y)
    }

    rotate (degrees) {
        this.sprite.setAngle(this.sprite.angle + degrees)
        this.sprite.body.gravity = rotateVector(this.sprite.body.gravity, degrees)
    }
}
import { rotateVector } from './rotateVector'
import { PlayerAttributes } from './player-attributes'
import { CreateTween, deltaTime } from './main.js'
import { PlayerSpine } from './playerSpine.js'
import { ParticleEffect } from './particleEffect.js'
import 'phaser'

export let recoveryTimer = 0
let rotating = false
let playerSpine = null
//Used for particles a work in progress
let sceneInstance
//Used for particle system I started, will probably move to main.js
let particleList = []

export class Player {
    constructor (scene, x, y) {
        sceneInstance = scene
        this.sprite = scene.physics.add.sprite(x, y, 'dude')
        this.sprite.visible = false
        this.sprite.body.gravity = { x: 0, y: 1000 }
        this.sprite.body.maxSpeed = 1000
        this.sprite.body.setSize(25, 25)
        this.canRotate = true
        this.sprite.externalAcceleration = { x: 0, y: 0 }
        this.attributes = new PlayerAttributes()
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
        
        //Create the player spine class(Handles animation and setting up the spine)
        playerSpine = new PlayerSpine(scene, this.sprite.body.x, this.sprite.body.y)
    }

    update (cursors) {
        if(!rotating)
        {
            this.handleMovement(cursors)

            if(recoveryTimer > 0)
                recoveryTimer -= deltaTime
        }
        playerSpine.update(this)

        particleList.forEach(this.updateParticles)
    }

    updateParticles(item, index) {
        item.update()
    }

    handleMovement(cursors) {
        const sprite = this.sprite
        const body = sprite.body
        const accel = new Phaser.Math.Vector2(0, 0)
        const rotatedVelocity = rotateVector(body.velocity, -this.sprite.angle)

         if(recoveryTimer <= 0) {
            if (cursors.left.isDown) {
                accel.x = (-this.attributes.velX - rotatedVelocity.x) * this.attributes.ease
                playerSpine.flipPlayer(true)
                playerSpine.playAnimation('run', true)

                //sprite.anims.play('left', true)
            }
            else if (cursors.right.isDown) {
                accel.x = (this.attributes.velX - rotatedVelocity.x) * this.attributes.ease
                playerSpine.flipPlayer(false)
                playerSpine.playAnimation('run', true)
                
                
                //sprite.anims.play('right', true)
            }
            else {
                accel.x = (0 - rotatedVelocity.x) * this.attributes.ease
                playerSpine.playAnimation('idle', true)
                //sprite.anims.play('turn')
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
        }
        else {
            //Recovering
            accel.x = (-rotatedVelocity.x * .03)
        }

        const rotatedAccel = rotateVector(accel, this.sprite.angle)
        body.velocity.x += this.sprite.externalAcceleration.x + rotatedAccel.x
        body.velocity.y += this.sprite.externalAcceleration.y + rotatedAccel.y

        // limit speed so we can't run through blocks
        body.velocity.x = Phaser.Math.Clamp(body.velocity.x, -800, 800)
        body.velocity.y = Phaser.Math.Clamp(body.velocity.y, -800, 800)

        this.sprite.externalAcceleration.x = 0
        this.sprite.externalAcceleration.y = 0

        this.onRotate()
    }

    rotationComplete(tween, targets, body) {
        //Reenable the body while setting velocity back to 0
        body.enable = true
        rotating = false
    }

    rotate (degrees, duration = 1000) {
        //Disable body and set velocity to 0 while rotating
        this.sprite.body.enable = false
        this.sprite.body.velocity = new Phaser.Math.Vector2(0, 0)
        this.sprite.body.newVelocity = new Phaser.Math.Vector2(0, 0)
        rotating = true
        //Create the tween for rotation and set callback for when complete
        CreateTween({targets: this.sprite, ease: "Sine.easeInOut", duration: duration,  onComplete: this.rotationComplete,  onCompleteParams: [ this.sprite.body ], angle: this.sprite.angle + degrees})
        //Rotate Spine(Might remove the tween above soon.)
        CreateTween({targets: playerSpine.spine, ease: "Sine.easeInOut", duration: duration, angle: playerSpine.spine.angle + degrees})
        this.sprite.body.gravity = rotateVector(this.sprite.body.gravity, degrees)
        this.onRotate()
    }

    onRotate () {
        const angle = this.sprite.angle
        const rotatedVelocity = rotateVector(this.sprite.body.velocity, -this.sprite.angle)
        const kicker = rotatedVelocity.y < 0 ? 25 : 0
        if (angle > -45 && angle < 45) {
            this.dir = 'down'
            this.sprite.body.setSize(25, 25 + kicker)
            this.sprite.body.setOffset(4, 23 - kicker)
        } else if (angle >= 45 && angle <= 135) {
            this.dir = 'left'
            this.sprite.body.setSize(25 + kicker, 25)
            this.sprite.body.setOffset(-8, 10)
        } else if (angle > 135 || angle < -135) {
            this.dir = 'up'
            this.sprite.body.setSize(25, 25 + kicker)
            this.sprite.body.setOffset(4, 0)
        } else {
            this.dir = 'right'
            this.sprite.body.setSize(25 + kicker, 25)
            this.sprite.body.setOffset(15 - kicker, 12)
        }
    }

    removeFromList(particle) {
        //Used for particle system I started, will probably move to main.js
        var index = particleList.indexOf(particle);
        if (index > -1) {
          particleList.splice(index, 1);
        }
        console.log(particleList)
    }
}

export function SetRecovery(recovery) {
    recoveryTimer = recovery
    //playerSpine.playAnimation('death', false)
}
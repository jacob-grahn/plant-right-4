import { rotateVector } from './rotateVector'
import { PlayerAttributes } from './player-attributes'
import { CreateTween, deltaTime, BlockedSide, CheckOverlapping, TileOverlapping } from './main.js'
import { PlayerSpine } from './playerSpine.js'
import { ParticleEffect } from './particleEffect.js'
import 'phaser'

export let recoveryTimer = 0
let rotating = false
let playerSpine = null
let extraSideVel = 0
let playerSprite

let grounded, crouching = false
let blockAbove = false
let rect

export class Player {
    constructor (scene, x, y) {
        //Used as base but set to invisible
        this.sprite = scene.physics.add.sprite(x, y, 'dude')
        this.sprite.visible = false
        this.sprite.body.gravity = { x: 0, y: 1000 }
        this.sprite.body.maxSpeed = 1000
        this.sprite.body.setSize(25, 25)
        playerSprite = this.sprite
        this.canRotate = true
        this.sprite.externalAcceleration = { x: 0, y: 0 }
        this.attributes = new PlayerAttributes()
        this.onRotate()
        rect = scene.add.graphics(0, 0)
        rect.depth = 1
        /* Dont think we'll need this again?
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
        */
        
        //Create the player spine class(Handles animation and setting up the spine)
        playerSpine = new PlayerSpine(scene, this.sprite.body.x, this.sprite.body.y)
    }

    updatePlayerHeadCheck() {
        const nextSize = new Phaser.Math.Vector2(15, 25)
        const nextSizeSmall = new Phaser.Math.Vector2(7.5, 25)
        let rotatedSize = rotateVector(nextSize, this.sprite.angle)
        let rotatedSizeSmall = rotateVector(nextSizeSmall, this.sprite.angle)
         //Make size absolute
        rotatedSize = new Phaser.Math.Vector2(Math.abs(rotatedSize.x), Math.abs(rotatedSize.y))
        rotatedSizeSmall = new Phaser.Math.Vector2(Math.abs(rotatedSizeSmall.x), Math.abs(rotatedSizeSmall.y))
        
        //Update positions
        let centerRectPos = new Phaser.Math.Vector2(0, -40)
        let rightRectPos = new Phaser.Math.Vector2(0, -40)
        let leftRectPos = new Phaser.Math.Vector2(0, -40)

        let rotatedPos, leftRotatedPos, rightRotatedPos
        let kicker = grounded ? 10 : 0
        //Fixing positions after rotate
        switch(this.dir) {
            case('down'):
                centerRectPos.x = leftRectPos.x = rightRectPos.x += .5
            break
            case('left'):
                centerRectPos.x = leftRectPos.x = rightRectPos.x += .5
            break
            case('up'):
                centerRectPos.x = leftRectPos.x = rightRectPos.x -= .5
            break
            case('right'):
                centerRectPos.x = leftRectPos.x = rightRectPos.x -= .5
            break
        }

        centerRectPos.y += kicker
        leftRectPos.x -= nextSize.x / 2
        leftRectPos.y += kicker
        rightRectPos.x += nextSize.x / 2
        rightRectPos.y += kicker

        centerRectPos = rotateVector(centerRectPos, this.sprite.angle)
        centerRectPos.add(this.sprite.body.center)

        leftRectPos = rotateVector(leftRectPos, this.sprite.angle)
        leftRectPos.add(this.sprite.body.center)

        rightRectPos = rotateVector(rightRectPos, this.sprite.angle)
        rightRectPos.add(this.sprite.body.center)

        rect.clear()
        rect.lineStyle(.1, 0x00ff00, 1)
        rect.fillStyle(0xFFFFFF, 1.0)

       

        let rect1 = new Phaser.Geom. Rectangle(centerRectPos.x, centerRectPos.y, rotatedSize.x, rotatedSize.y)
        rect1.centerX = centerRectPos.x
        rect1.centerY = centerRectPos.y
        //Enable for debug
        //rect.strokeRect(rect1.x, rect1.y, rect1.width, rect1.height)
        TileOverlapping(rect1, "center")

        let rect2 = new Phaser.Geom. Rectangle(leftRectPos.x, leftRectPos.y, rotatedSizeSmall.x, rotatedSizeSmall.y)
        rect2.centerX = leftRectPos.x
        rect2.centerY = leftRectPos.y
        //Enable for debug
        //rect.strokeRect(rect2.x, rect2.y, rect2.width, rect2.height)
        TileOverlapping(rect2, "left")

        let rect3 = new Phaser.Geom. Rectangle(rightRectPos.x, rightRectPos.y, rotatedSizeSmall.x, rotatedSizeSmall.y)
        rect3.centerX = rightRectPos.x
        rect3.centerY = rightRectPos.y
        //Enable for debug
        //rect.strokeRect(rect3.x, rect3.y, rect3.width, rect3.height)
        TileOverlapping(rect3, "right")
    }

    update (cursors) {
        if(!rotating)
        {
            blockAbove = false
            extraSideVel = 0

            this.updatePlayerHeadCheck()

            this.handleMovement(cursors)

            if(recoveryTimer > 0)
                recoveryTimer -= deltaTime
        }
        playerSpine.update(this)
    }

    handleMovement(cursors) {
        const sprite = this.sprite
        const body = sprite.body
        const accel = new Phaser.Math.Vector2(0, 0)
        const rotatedVelocity = rotateVector(body.velocity, -this.sprite.angle)

        if(BlockedSide('down')) {
            grounded = true
        }
        else {
            grounded = false
        }

        if(grounded && blockAbove) {
            console.log("Crawl man")
            crouching = true;
        }
        else {
            crouching = false
        }

         if(recoveryTimer <= 0) {
            if (cursors.left.isDown) {
                playerSpine.flipPlayer(true)
                if(!crouching) {
                    accel.x = (-this.attributes.velX - rotatedVelocity.x) * this.attributes.ease

                    if(grounded) {
                        playerSpine.playAnimation('run', true)
                    }
                }
                else {
                    accel.x = (-this.attributes.velX * .2 - rotatedVelocity.x) * this.attributes.ease
                }
            }
            else if (cursors.right.isDown) {
                playerSpine.flipPlayer(false)
                if(!crouching) {
                    accel.x = (this.attributes.velX - rotatedVelocity.x) * this.attributes.ease
                    
                    if(grounded) {
                        playerSpine.playAnimation('run', true)
                    }
                }
                else {
                    accel.x = (this.attributes.velX * .2 - rotatedVelocity.x) * this.attributes.ease
                }
            }
            else {
                accel.x = (0 - rotatedVelocity.x) * this.attributes.ease
                if(grounded && !crouching) { 
                    playerSpine.playAnimation('idle', true)
                }
            }

            if (cursors.up.isDown && sprite.body.blocked[this.dir] && !crouching) {
                //Placeholder until find better way of doing this, without this if you do ledge jump you'll just hit the brick above you, maybe set x position to be outside of block when jump?
                accel.x -= extraSideVel

                accel.y = -this.attributes.velY
            }

            if(!grounded)
                    playerSpine.playAnimation('jump', false)

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
        const rotatedVelocity = rotateVector(this.sprite.body.newVelocity, -this.sprite.angle)

        let kicker = rotatedVelocity.y <= 0 ? 25 : 0
        if(this.sprite.body.blocked[this.dir])
        {
            kicker = -10
        }

        if (angle > -45 && angle < 50) {
            this.dir = 'down'
            this.sprite.body.setSize(25, 25 + kicker)
            this.sprite.body.setOffset(4, 23 - kicker)
        } else if (angle >= 45 && angle <= 135) {
            this.dir = 'left'
            this.sprite.body.setSize(25 + kicker, 25)
            this.sprite.body.setOffset(-8, 11.5)
        } else if (angle > 135 || angle < -135) {
            this.dir = 'up'
            this.sprite.body.setSize(25, 25 + kicker)
            this.sprite.body.setOffset(3.5, 0)
        } else {
            this.dir = 'right'
            this.sprite.body.setSize(25 + kicker, 25)
            this.sprite.body.setOffset(15 - kicker, 11.5)
        }
    }
}

export function SetRecovery(recovery) {
    recoveryTimer = recovery
    //playerSpine.playAnimation('death', false)
}

export function SetBlockAbove(name, tile, rect) {
    //Very WIP probably need to find different way for ledge jump, open to suggestions
    const rotatedTileCenter = rotateVector(new Phaser.Math.Vector2(tile.getCenterX(), tile.getCenterY()), playerSprite.angle)
    const rotatedRect = rotateVector(new Phaser.Math.Vector2(rect.x, rect.y), playerSprite.angle)
    const dist = (rotatedTileCenter.x - rotatedRect.x)
    const multiple = dist <= 19.5 ? 2 : 1
    if (name == "left") {
        extraSideVel = -100 * multiple
    } else if (name == "right") {
        extraSideVel = 100 * multiple
    } else {
         blockAbove = true
    }
}
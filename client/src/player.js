import { rotateVector } from './rotateVector'
import { PlayerAttributes } from './player-attributes'
import { CreateTween, deltaTime, BlockedSide, TileOverlapping } from './main.js'
import { PlayerSpine } from './playerSpine.js'
import { Maths } from './Maths.js'
import 'phaser'

export let recoveryTimer = 0
let rotating = false
let playerSpine = null

let blockAbove = false

export class Player {
  constructor (scene, x, y) {
    // Used as base but set to invisible
    this.sprite = scene.physics.add.sprite(x, y, 'dude')
    this.sprite.visible = false
    this.sprite.body.gravity = { x: 0, y: 750 }
    this.sprite.body.maxSpeed = 1000
    this.sprite.body.setSize(25, 25)
    this.setupPlayerHeadCheck(scene)
    this.canRotate = true
    this.sprite.externalAcceleration = { x: 0, y: 0 }
    this.attributes = new PlayerAttributes()
    this.onRotate()
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
    // Create the player spine class(Handles animation and setting up the spine)
    playerSpine = new PlayerSpine(scene, this.sprite.body.x, this.sprite.body.y)
  }

  setupPlayerHeadCheck (scene) {
    this.headChecker = scene.physics.add.sprite(0, 0, 'dude')
    this.headChecker.visible = false
    this.headChecker.body.setSize(25, 25)
    this.headChecker.onCollide = false
  }

  crouchCheck () {
    //  Reset to false before checking if a block is above
    blockAbove = false
    let headCheckPos = new Phaser.Math.Vector2(0, -25)
    headCheckPos = rotateVector(headCheckPos, this.sprite.angle)
    headCheckPos.add(this.sprite.body.position)
    this.headChecker.body.position = headCheckPos

    TileOverlapping(this.headChecker)
  }

  update (cursors) {
    this.crouchCheck()
    if (!rotating) {
      this.handleMovement(cursors)

      if (recoveryTimer > 0) { recoveryTimer -= deltaTime }
    }
    playerSpine.update(this)
  }

  handleMovement (cursors) {
    const sprite = this.sprite
    const body = sprite.body
    const accel = new Phaser.Math.Vector2(0, 0)
    const rotatedVelocity = rotateVector(body.velocity, -this.sprite.angle)

    if (BlockedSide('down')) {
      this.grounded = true
    } else {
      this.grounded = false
    }

    if (this.grounded && blockAbove) {
      console.log('Crawl man')
      this.crouching = true
    } else {
      this.crouching = false
    }

    if (recoveryTimer <= 0) {
      if (cursors.left.isDown) {
        playerSpine.flipPlayer(true)
        if (!this.crouching) {
          accel.x = (-this.attributes.velX - rotatedVelocity.x) * this.attributes.ease

          if (this.grounded) {
            playerSpine.playAnimation('run', true)
          }
        } else {
          playerSpine.playAnimation('crouchWalk', true)
          accel.x = (-this.attributes.velX * 0.2 - rotatedVelocity.x) * this.attributes.ease
        }
      } else if (cursors.right.isDown) {
        playerSpine.flipPlayer(false)
        if (!this.crouching) {
          accel.x = (this.attributes.velX - rotatedVelocity.x) * this.attributes.ease

          if (this.grounded) {
            playerSpine.playAnimation('run', true)
          }
        } else {
          playerSpine.playAnimation('crouchWalk', true)
          accel.x = (this.attributes.velX * 0.2 - rotatedVelocity.x) * this.attributes.ease
        }
      } else {
        accel.x = (0 - rotatedVelocity.x) * this.attributes.ease
        if (this.grounded && !this.crouching) {
          playerSpine.playAnimation('idle', true)
        } else if (this.crouching) {
          playerSpine.playAnimation('crouch', true)
        }
      }

      if (cursors.up.isDown) {
        this.jump(accel)
      } else {
        this.stillHoldingUp = false
      }

      if (!this.grounded) { playerSpine.playAnimation('jump', false) }

      if (cursors.down.isDown) {
        if (this.canRotate) {
          this.rotate(90)
          this.canRotate = false
        }
      } else {
        this.canRotate = true
      }
    } else {
      // Recovering
      accel.x = (-rotatedVelocity.x * 0.03)
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

  jump (accel) {
    let jumpVal = 0
    let velY = 0
    if (this.grounded || this.velY > 0) {
      this.stillHoldingUp = false
    }
    if ((this.grounded && !this.crouching) || this.stillHoldingUp) {
      if (!this.stillHoldingUp) {
        this.stillHoldingUp = true
        this.remainingJumpVel = 0.25 + this.attributes.velY * 0.02
      }
      if (this.stillHoldingUp) {
        //  Made similar to pr3's method of handling jumps
        //  can change if anyone knows a better way
        jumpVal = this.remainingJumpVel * (1.0 - Math.pow(1.0 - 10.0 / 27.0, 27.0 * deltaTime / 1000.0))
        jumpVal = Maths.clamp(jumpVal, 0, this.remainingJumpVel)
        this.remainingJumpVel = this.remainingJumpVel - jumpVal
        velY = velY + jumpVal / deltaTime
      }
    }
    accel.y = accel.y - velY * this.attributes.velY
  }

  rotationComplete (tween, targets, body) {
    // Reenable the body while setting velocity back to 0
    body.enable = true
    rotating = false
  }

  rotate (degrees, duration = 1000) {
    // Disable body and set velocity to 0 while rotating
    this.sprite.body.enable = false
    this.sprite.body.velocity = new Phaser.Math.Vector2(0, 0)
    this.sprite.body.newVelocity = new Phaser.Math.Vector2(0, 0)
    rotating = true
    // Create the tween for rotation and set callback for when complete
    CreateTween({ targets: this.sprite, ease: 'Sine.easeInOut', duration: duration, onComplete: this.rotationComplete, onCompleteParams: [ this.sprite.body ], angle: this.sprite.angle + degrees })
    // Rotate Spine(Might remove the tween above soon.)
    CreateTween({ targets: playerSpine.spine, ease: 'Sine.easeInOut', duration: duration, angle: playerSpine.spine.angle + degrees })
    this.sprite.body.gravity = rotateVector(this.sprite.body.gravity, degrees)
    this.onRotate()
  }

  onRotate () {
    const angle = this.sprite.angle
    const rotatedVelocity = rotateVector(this.sprite.body.newVelocity, -this.sprite.angle)

    let kicker = rotatedVelocity.y <= 0 ? 25 : 0
    if (this.sprite.body.blocked[this.dir]) {
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

export function SetRecovery (recovery) {
  recoveryTimer = recovery
  // playerSpine.playAnimation('death', false)
}

export function SetBlockAbove (sprite, tile) {
  blockAbove = true
}

import { rotateVector } from './rotateVector'
import { PlayerAttributes } from './player-attributes'
import { deltaTime, BlockedSide, TileOverlapping } from './main.js'
import { PlayerSpine } from './playerSpine.js'
import { Maths } from './Maths.js'
import 'phaser'

let blockAbove = false
const baseGravityVector = { x: 0, y: 750 }

export class Player {
  constructor (scene, x, y) {
    this.attributes = new PlayerAttributes()
    this.externalAcceleration = { x: 0, y: 0 }
    this.playerSpine = new PlayerSpine(scene, x, y)

    scene.physics.add.existing(this.playerSpine.spine)

    this.body = this.playerSpine.spine.body
    this.sprite = this.playerSpine.spine
    console.log(this.body.x, this.body.y)
    this.body.gravity = { ...baseGravityVector }
    this.body.maxSpeed = 1000
    this.body.setSize(25, 25)
    this.setupPlayerHeadCheck(scene)
    this.rotate(0)
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
    headCheckPos.add(this.body.position)
    this.headChecker.body.position = headCheckPos

    TileOverlapping(this.headChecker)
  }

  update (cursors) {
    this.crouchCheck()
    this.handleMovement(cursors)
  }

  handleMovement (cursors) {
    const body = this.body
    const accel = new Phaser.Math.Vector2(0, 0)
    const rotatedVelocity = rotateVector(body.velocity, -this.sprite.angle)

    if (BlockedSide('down')) {
      this.grounded = true
    } else {
      this.grounded = false
    }

    if (this.grounded && blockAbove) {
      this.crouching = true
    } else {
      this.crouching = false
    }

    if (cursors.left.isDown) {
      console.log(this.sprite.x, this.sprite.y)
      this.playerSpine.flipPlayer(true)
      if (!this.crouching) {
        accel.x = (-this.attributes.velX - rotatedVelocity.x) * this.attributes.ease

        if (this.grounded) {
          this.playerSpine.playAnimation('run', true)
        }
      } else {
        this.playerSpine.playAnimation('crouchWalk', true)
        accel.x = (-this.attributes.velX * 0.2 - rotatedVelocity.x) * this.attributes.ease
      }
    } else if (cursors.right.isDown) {
      this.playerSpine.flipPlayer(false)
      if (!this.crouching) {
        accel.x = (this.attributes.velX - rotatedVelocity.x) * this.attributes.ease

        if (this.grounded) {
          this.playerSpine.playAnimation('run', true)
        }
      } else {
        this.playerSpine.playAnimation('crouchWalk', true)
        accel.x = (this.attributes.velX * 0.2 - rotatedVelocity.x) * this.attributes.ease
      }
    } else {
      accel.x = (0 - rotatedVelocity.x) * this.attributes.ease
      if (this.grounded && !this.crouching) {
        this.playerSpine.playAnimation('idle', true)
      } else if (this.crouching) {
        this.playerSpine.playAnimation('crouch', true)
      }
    }

    if (cursors.up.isDown) {
      this.jump(accel)
    } else {
      this.stillHoldingUp = false
    }

    if (!this.grounded) {
      this.playerSpine.playAnimation('jump', false)
    }

    if (cursors.rKey.isDown) { // dev -- test rotation using the R key
      this.rotate(1)
    }

    const rotatedAccel = rotateVector(accel, this.sprite.angle)
    body.velocity.x += this.externalAcceleration.x + rotatedAccel.x
    body.velocity.y += this.externalAcceleration.y + rotatedAccel.y

    // limit speed so we can't run through blocks
    body.velocity.x = Phaser.Math.Clamp(body.velocity.x, -800, 800)
    body.velocity.y = Phaser.Math.Clamp(body.velocity.y, -800, 800)

    this.externalAcceleration.x = 0
    this.externalAcceleration.y = 0
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
        jumpVal = this.remainingJumpVel * (1.0 - Math.pow(1.0 - 10.0 / 27.0, 27.0 * deltaTime / 1000.0))
        jumpVal = Maths.clamp(jumpVal, 0, this.remainingJumpVel)
        this.remainingJumpVel = this.remainingJumpVel - jumpVal
        velY = velY + jumpVal / deltaTime
      }
    }
    accel.y = accel.y - velY * this.attributes.velY
  }

  rotate (degrees) {
    this.sprite.setAngle(this.sprite.angle + degrees)
    this.body.gravity = rotateVector(baseGravityVector, this.sprite.angle)
  }
}

export function SetBlockAbove (sprite, tile) {
  blockAbove = true
}

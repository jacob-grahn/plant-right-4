/* global Phaser */

import { rotateVector } from '../rotateVector'
import { PlayerAttributes } from './player-attributes'
import { BlockedSide } from '../scenes/race/race'
import { PlayerSpine } from './playerSpine.js'
import { HurtTimer } from './hurt-timer'
import { JumpGumption } from './jump-gumption'
import { SmoothRotator } from './smooth-rotator'
import 'phaser'

let blockAbove = false
const baseGravityVector = { x: 0, y: 750 }

export class Player {
  constructor (scene, x, y) {
    this.scene = scene
    this.attributes = new PlayerAttributes()
    this.externalAcceleration = { x: 0, y: 0 }
    this.lastAngle = undefined
    this.playerSpine = new PlayerSpine(scene, 0, 0)
    this.hurtTimer = new HurtTimer()
    this.jumpGumption = new JumpGumption()
    this.smoothRotator = new SmoothRotator()
    this.container = scene.add.container(x, y, [this.playerSpine.spine])

    scene.physics.add.existing(this.container)
    this.container.body.setSize(26, 26)
    this.container.body.setOffset(-13, -13)
    this.body = this.container.body
    this.sprite = this.container
    this.body.gravity = { ...baseGravityVector }
    this.body.maxSpeed = 1000

    // this.setupPlayerHeadCheck(scene)
  }

  /* setupPlayerHeadCheck (scene) {
        this.headChecker = scene.physics.add.sprite(0, 0, 'dude')
        this.headChecker.visible = false
        this.headChecker.body.setSize(25, 25)
        this.headChecker.onCollide = false
    } */

  crouchCheck () {
    //  Reset to false before checking if a block is above
    blockAbove = false
    let headCheckPos = new Phaser.Math.Vector2(0, -25)
    headCheckPos = rotateVector(headCheckPos, this.sprite.angle)
    headCheckPos.add(this.body.position)
    // this.headChecker.body.position = headCheckPos
    // TileOverlapping(this.headChecker)
  }

  update (cursors, delta) {
    this.crouchCheck()
    this.handleMovement(cursors, delta)
  }

  handleMovement (cursors, delta) {
    const body = this.body
    const accel = new Phaser.Math.Vector2(0, 0)
    const rotatedVelocity = rotateVector(body.velocity, -this.sprite.angle)
    const curTime = new Date().getTime()

    if (this.hurtTimer.isInvincible() && Math.round(curTime / 150) % 2 === 0) {
      this.sprite.alpha = 0.25
    } else {
      this.sprite.alpha = 1
    }

    if (this.hurtTimer.isHurt()) {
      cursors.up.isDown = false
      cursors.down.isDown = false
      cursors.left.isDown = false
      cursors.right.isDown = false
      cursors.rKey.isDown = false
    }

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
      this.playerSpine.setFlipXHack(true)
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
      this.playerSpine.setFlipXHack(false)
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

    // jump
    if (cursors.up.isDown) {
      if (this.grounded) {
        this.stillHoldingUp = true
        this.jumpGumption.reset()
        accel.y -= this.attributes.jumpVel
      }
      if (this.stillHoldingUp) {
        accel.y -= this.jumpGumption.getGumption(delta)
      }
    } else {
      if (this.stillHoldingUp) {
        this.stillHoldingUp = false
      }
    }

    if (!this.grounded) {
      this.playerSpine.playAnimation('jump', false)
    }

    if (cursors.rKey.isDown && !this.smoothRotator.isRotating()) { // dev -- test rotation using the R key
      this.smoothRotator.rotate(this.scene, this.sprite, 90)
    }

    const rotatedAccel = rotateVector(accel, this.sprite.angle)
    body.velocity.x += this.externalAcceleration.x + rotatedAccel.x
    body.velocity.y += this.externalAcceleration.y + rotatedAccel.y

    // limit speed so we can't run through blocks
    body.velocity.x = Phaser.Math.Clamp(body.velocity.x, -800, 800)
    body.velocity.y = Phaser.Math.Clamp(body.velocity.y, -800, 800)

    this.externalAcceleration.x = 0
    this.externalAcceleration.y = 0

    // adjust to rotations
    if (this.sprite.angle !== this.lastAngle) {
      this.body.gravity = rotateVector(baseGravityVector, this.sprite.angle)
      this.playerSpine.spine.setPosition(0, 13)
      this.lastAngle = this.sprite.angle
    }
  }

  getHurt () {
    this.hurtTimer.getHurt()
  }
}

export function SetBlockAbove (sprite, tile) {
  blockAbove = true
}

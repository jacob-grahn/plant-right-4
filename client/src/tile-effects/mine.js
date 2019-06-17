/* global Phaser */

import { rotateVector } from '../rotateVector'
import { recoveryTimer, SetRecovery } from '../player'

export const mine = (playerSprite, tile) => {
  const explodeForce = 400

  // Set recovery for 2 seconds if not recovering
  if (recoveryTimer <= 0) {
    SetRecovery(2000)
  }

  const tilePos = new Phaser.Math.Vector2(tile.x, tile.y)
  let dir = new Phaser.Math.Vector2(playerSprite.body.position.x / 30, playerSprite.body.position.y / 30)
  dir.subtract(tilePos)
  dir = rotateVector(dir, -playerSprite.angle)

  const angle = Math.atan2(dir.y, dir.x)
  const velX = Math.cos(angle) * explodeForce
  const velY = Math.sin(angle) * explodeForce
  const rotatedVel = rotateVector(new Phaser.Math.Vector2(velX, velY), playerSprite.angle)

  playerSprite.body.velocity.x = rotatedVel.x
  playerSprite.body.velocity.y = rotatedVel.y
  tile.tilemap.removeTile(tile)
}

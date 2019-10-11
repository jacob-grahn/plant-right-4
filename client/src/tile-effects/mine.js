/* global Phaser */

import { Explosion } from '../Explosion.js'
import { rotateVector } from '../rotateVector'

export const mine = (player, tile) => {
  //  Spawn explosion
  Explosion.CreateExplosion(tile.getCenterX(), tile.getCenterY())

  const explodeForce = 700

  const tilePos = new Phaser.Math.Vector2(tile.x, tile.y)
  let dir = new Phaser.Math.Vector2(player.body.position.x / 30, player.body.position.y / 30)
  dir.subtract(tilePos)
  dir = rotateVector(dir, -player.sprite.angle)

  const angle = Math.atan2(dir.y, dir.x)
  const velX = Math.cos(angle) * explodeForce
  const velY = Math.sin(angle) * explodeForce
  const rotatedVel = rotateVector(new Phaser.Math.Vector2(velX, velY), player.angle)

  // player.body.velocity.x = rotatedVel.x
  /// player.body.velocity.y = rotatedVel.y
  tile.tilemap.removeTile(tile)
}

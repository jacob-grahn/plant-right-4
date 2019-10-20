import { Explosion } from '../Explosion.js'

export const mine = (player, tile) => {
  //  Spawn explosion
  Explosion.CreateExplosion(tile.getCenterX(), tile.getCenterY())

  const explodeForce = 1000
  const distX = (tile.x * 30) - player.body.position.x
  const distY = (tile.y * 30) - player.body.position.y
  const angle = Math.atan2(distY, distX)
  const velX = Math.cos(angle) * explodeForce
  const velY = Math.sin(angle) * explodeForce

  player.externalAcceleration.x -= velX
  player.externalAcceleration.y -= velY
  player.getHurt()

  tile.tilemap.removeTile(tile)
}

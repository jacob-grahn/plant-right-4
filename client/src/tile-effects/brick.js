import { GetScene } from '../main.js'
import { ParticleEffect } from '../particleEffect.js'

export const brick = (player, tile) => {
  tile.tilemap.removeTile(tile)

  for (var i = 0; i < 4; i++) {
    var particle = new ParticleEffect(player, GetScene(), tile)
    particle.sprite.scaleX = 0.5
    particle.sprite.scaleY = 0.5

    particle.sprite.x = tile.getCenterX()
    particle.sprite.y = tile.getCenterY()
  }
}

import { GetScene } from '../main.js'
import { ParticleEffect } from '../particleEffect.js'

export const brick = (playerSprite, tile) => {
  tile.tilemap.removeTile(tile)

  for (var i = 0; i < 4; i++) {
    var particle = new ParticleEffect(playerSprite, GetScene(), tile)
    particle.sprite.scaleX = 0.5
    particle.sprite.scaleY = 0.5

    particle.sprite.x = tile.getCenterX()
    particle.sprite.y = tile.getCenterY()
  }
}

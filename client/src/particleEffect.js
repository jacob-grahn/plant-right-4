import { AddParticle, RemoveParticle, GetRotatedVector } from './main.js'
import { rotateVector } from './rotateVector.js'

let sprite, angle
let velX, velY, velRot, friction, fade

//Just the start of particle system, will be used for shatter effect on block. Used some code from pr3 so its very similar so far
export class ParticleEffect {
	constructor (playerSprite, scene, tile, param2 = 1, param3 = 0.95, param4 = 0.02, param5 = 150, param6 = 400, param7 = 15, param8 = 0, param9 = 0) {
		AddParticle(this)
		this.sprite = scene.physics.add.sprite(0, 0, 'blocksSH')
        this.sprite.setFrame(tile.index - 1);

        this.angle = playerSprite.angle
        this.sprite.body.gravity = { x: 0, y: 0 }
        this.friction = param3
        this.fade = param4
        this.velX = Math.random() * (param5 * 2) - param5
        this.velY = Math.random() * (param6) - param6
        this.velRot = Math.random() * (param7 * 2) - param7
        this.velX += param8
        this.velY += param9
	}

	remove() {

		RemoveParticle(this)
		this.sprite.exists = false
	}

	update() {
		this.velX *= this.friction
		this.velY *= this.friction
		this.velRot *= this.friction
		this.velY += 15
		this.sprite.angle += this.velRot
		this.sprite.alpha -= this.fade
		if( this.sprite.alpha <= 0) {
			this.remove()
		}
		//Rotated the velocity of the particles
		let newVel = rotateVector(new Phaser.Math.Vector2(this.velX, this.velY), this.angle)
		this.sprite.body.velocity = new Phaser.Math.Vector2(newVel.x, newVel.y)
	}
}
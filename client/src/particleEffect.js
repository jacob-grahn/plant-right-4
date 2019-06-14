let sprite
let velX, velY, velRot, friction, fade
let curPlayer

//Just the start of particle system, will be used for shatter effect on block. Used some code from pr3 so its very similar so far
export class ParticleEffect {
	constructor (player, scene, param2 = 1, param3 = 0.95, param4 = 0.01, param5 = 10, param6 = 10, param7 = 15, param8 = 0, param9 = 0) {
		curPlayer = player
		this.sprite = scene.physics.add.sprite(0, 0, 'dude')
        this.sprite.body.gravity = { x: 0, y: 1000 }
        this.friction = param3
        this.fade = param4
        this.velX = Math.random() * (param5 * 2) - param5
        this.velY = Math.random() * (param6 * 2) - param6
        this.velRot = Math.random() * (param7 * 2) - param7
        this.velX += param8
        this.velY += param9
        this.sprite.body.maxSpeed = 1000
        this.sprite.body.setSize(25, 25)
        //this.canRotate = true
        this.sprite.externalAcceleration = { x: 0, y: 0 }
	}

	remove() {

		curPlayer.removeFromList(this)
		this.sprite.exists = false
	}

	update() {
		this.velX *= this.friction
		this.velY *= this.friction
		this.velRot *= this.friction
		this.velY += this.gravity * 100
		this.sprite.angle += this.velRot
		this.sprite.alpha -= this.fade
		if( this.sprite.alpha <= 0) {
			this.remove()
		}
		//this.sprite.body.velocity = new Phaser.Math.Vector2(velX, velY)
	}
}
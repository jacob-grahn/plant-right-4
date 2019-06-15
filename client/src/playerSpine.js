import { deltaTime } from './main.js'
import 'phaser'

let spine


export class PlayerSpine {
    constructor (scene, x, y, spine = 'PRFGuy', animation = 'idle', play = true) {
    	this.spine = scene.add.spine(x, y, spine, animation, play)
    	this.spine.depth = 1
    	this.spine.setScale(.2)
    	console.log(this.spine.skeleton)
    	//Here, just testing the possibily of changing colors and also tested textures later, its a go for sure. Might be a bit weird to implement though
    	var color = Phaser.Display.Color.HexStringToColor('#FF0000');
    	this.spine.skeleton.slots[4].attachment.color = color
    	this.spine.customParams = {
     		animation,
  		}
    }

    playAnimation(animation, repeat = false) {
    	//Only play the animation if it's different than current one.
    	if (this.spine.customParams.animation !== animation) {
    		this.spine.customParams.animation = animation
    		this.spine.play(this.spine.customParams.animation, repeat)
    	}
    }

    flipPlayer(flip = false) {
    	this.spine.flipX = flip
    }

     update(player) {
     	let newVel = player.sprite.body.newVelocity

     	//Make sure we dont move the sprite to a position that the body will be blocked at
     	if(player.sprite.body.blocked.left || player.sprite.body.blocked.right) {
     		newVel.x = 0
     	}
     	if(player.sprite.body.blocked.down || player.sprite.body.blocked.up) {
     		newVel.y = 0
     	}

     	this.spine.x = player.sprite.x + newVel.x
    	this.spine.y = player.sprite.y + newVel.y 
     }
}
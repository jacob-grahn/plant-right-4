import 'phaser'

let headNum = 1
let bodyNum = 1
let feetNum = 1

export class PlayerSpine {
  constructor (scene, x, y, spine = 'PRFGuy', animation = 'idle', play = true) {
    this.spine = scene.add.spine(x, y, spine, animation, play)
    this.spine.depth = 1
    this.spine.setScale(0.2)

    // Set the part and color
    this.setParts()
    this.setColors()

    this.spine.customParams = {
      animation
    }
  }

  setParts () {
    this.spine.skeleton.setAttachment('HeadOutline', 'Head' + headNum + 'Outline')
    this.spine.skeleton.setAttachment('HeadColor', 'Head' + headNum + 'Color')
    this.spine.skeleton.setAttachment('BodyOutline', 'Body' + bodyNum + 'Outline')
    this.spine.skeleton.setAttachment('BodyColor', 'Body' + bodyNum + 'Color')
    this.spine.skeleton.setAttachment('LFootOutline', 'Foot' + feetNum + 'Outline')
    this.spine.skeleton.setAttachment('LFootColor', 'Foot' + feetNum + 'Color')
    this.spine.skeleton.setAttachment('RFootOutline', 'Foot' + feetNum + 'Outline')
    this.spine.skeleton.setAttachment('RFootColor', 'Foot' + feetNum + 'Color')
  }

  setColors () {
    var HeadColor = '#3300FF'
    this.spine.skeleton.getAttachmentByName('HeadColor', 'Head' + headNum + 'Color').color.setFromString(HeadColor)

    var BodyColor = '#4d4dff'
    this.spine.skeleton.getAttachmentByName('BodyColor', 'Body' + bodyNum + 'Color').color.setFromString(BodyColor)

    var FeetColor = '#00ff00'
    this.spine.skeleton.getAttachmentByName('LFootColor', 'Foot' + feetNum + 'Color').color.setFromString(FeetColor)
    this.spine.skeleton.getAttachmentByName('RFootColor', 'Foot' + feetNum + 'Color').color.setFromString(FeetColor)
  }

  playAnimation (animation, repeat = false) {
    // Only play the animation if it's different than current one.
    if (this.spine.customParams.animation !== animation) {
      this.spine.customParams.animation = animation
      this.spine.play(this.spine.customParams.animation, repeat)
    }
  }

  flipPlayer (flip = false) {
    this.spine.flipX = flip
  }
}

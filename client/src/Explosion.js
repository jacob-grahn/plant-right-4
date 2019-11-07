import { GetScene } from './scenes/race/race'

export class Explosion {
  static CreateExplosion (x, y) {
  //  Create explosion animation, set scale and play
    var explosion = GetScene().add.spine(x, y, 'Explosion', 'Explode', true)
    explosion.setScale(0.2)

    //  Play sound once and destroy after
    GetScene().sound.play('explodesfx')

    //  Create a Event Listener to know when to destroy self
    explosion.state.addListener({
      event: function (trackIndex, event) {
        switch (event.data.name) {
          case ('DeleteSelf') :
            explosion.destroy()
            break
        }
      } })
  }
}

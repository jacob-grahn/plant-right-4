export class PlayerAttributes {
  constructor (jump = 50, speed = 50, accel = 50) {
    this.jump = jump
    this.speed = speed
    this.accel = accel
  }

  get velX () {
    return (this.speed * 5) + 100
  }

  get velY () {
    return (this.jump * 5) + 500
  }

  get ease () {
    return (this.accel / 500) + 0.1
  }
}

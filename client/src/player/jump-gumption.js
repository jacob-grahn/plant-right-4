// If you hold up after jumping, you will jump higher
// let's call this magic extra energy "gumption"

const accel = 0.7 // force of gumption
const durationMs = 700 // how long gumption lasts

export class JumpGumption {
  constructor () {
    this.usedMs = 0
  }

  getGumption (ms) {
    this.usedMs += ms
    if (this.usedMs < durationMs) {
      const percentRemaining = 1 - (this.usedMs / durationMs)
      return ms * (accel * percentRemaining)
    } else {
      return 0
    }
  }

  reset () {
    this.usedMs = 0
  }
}

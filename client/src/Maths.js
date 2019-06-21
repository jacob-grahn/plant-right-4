
export class Maths {
  // Should Contain extra math functions basically an extension the basic Math is js
  static clamp (val, min, max) {
    return val > max ? max : val < min ? min : val
  }
}

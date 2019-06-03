import 'phaser'

export const rotateVector = (vector, degrees) => {
    const rads = Phaser.Math.DegToRad(degrees)
    return Phaser.Math.Rotate({x: vector.x, y: vector.y}, rads)
}
export class SmoothRotator {

    constructor () {
        this.tween = undefined
    }

    rotate (game, target, deg) {
        this.stop()
        this.tween = game.tweens.add({
            targets: target,
            angle: target.angle + deg,
            duration: Math.abs(deg) * 7,
            onComplete: () => { this.stop() }
        });
    }

    stop () {
        if (this.tween) {
            this.tween.remove()
            this.tween = undefined
        }
    }

    isRotating () {
        return !!this.tween
    }
}
const hurtDuration = 1000
const invincibleDuration = 2000

export class HurtTimer {

    constructor () {
        this.hurtUntil = 0
        this.invincibleUntil = 0
    }

    getHurt () {
        const curTime = new Date().getTime()
        if (curTime > this.invincibleUntil) {
            this.hurtUntil = curTime + hurtDuration
            this.invincibleUntil = curTime + invincibleDuration
            return true
        }
        return false
    }

    isHurt () {
        const curTime = new Date().getTime()
        return curTime > this.hurtUntil
    }

    isInvincible () {
        const curTime = new Date().getTime()
        return curTime > this.invincibleUntil
    }
}
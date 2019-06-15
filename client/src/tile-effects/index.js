/* for when these are added
import { crumble } from './crumble'
import { vanish } from './vanish'
import { push } from './push'
import { safetyNet } from './safetyNet'
*/
import { down } from './down'
import { up } from './up'
import { left } from './left'
import { right } from './right'
import { mine } from './mine'


/* for when these are added
import { item } from './item'
import { finish } from './finish'
import { rotateClockwise } from './rotateClockwise'
import { rotateCounterclockwise } from './rotateCounterclockwise'
import { infiniteItem } from './infiniteItem'
import { happy } from './happy'
import { sad } from './sad'
import { heal } from './heal'
import { time } from './time'
*/
import { brick } from './brick'

const collideHandlers = {
    /*crumble,
    vanish,
    push,
    safetyNet,*/
    down,
    up,
    left,
    right,
    mine
}

const bumpHandlers = {
    /*item,
    finish,
    rotateClockwise,
    rotateCounterclockwise,
    infiniteItem,
    happy,
    sad,
    heal,
    time,*/
    brick
}

let sides = [
    'down',
    'left',
    'up',
    'right'
]

export function tileEffects (playerSprite, tile) {
    if (tile.properties.collideHandlers) {
        const collideHandlerNames = tile.properties.collideHandlers.split(',')
        collideHandlerNames.forEach((handlerName) => {
            const handler = collideHandlers[handlerName]
            if (handler) {
                handler(playerSprite, tile)
            }
        })
    } else if (tile.properties.bumpHandlers && touchingSide(playerSprite, 'up')) {
        const bumpHandlerNames = tile.properties.bumpHandlers.split(',')
        bumpHandlerNames.forEach((handlerName) => {
            const handler = bumpHandlers[handlerName]
            if (handler) {
                handler(playerSprite, tile)
            }
        })
    }
}

function touchingSide(playerSprite, side) {
    return playerSprite.body.blocked[rotateSide(side, playerSprite.angle)]
}

function rotateSide(side, angle) {
    const sideIndex = sides.indexOf(side)
    let i = 0

    if (angle > -45 && angle < 50) {
        i = 0
    } else if (angle >= 45 && angle <= 135) {
        i += 1
    } else if (angle > 135 || angle < -135) {
        i += 2
    } else {
       i += 3
    }
    return(sides[(sideIndex + i) % sides.length])
}

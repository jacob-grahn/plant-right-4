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

export function tileEffects (playerSprite, tile) {
    let handlers = null
    if (tile.properties.collideHandlers) {
        handlers = tile.properties.collideHandlers
    } else if (tile.properties.bumpHandlers) {
        handlers = tile.properties.bumpHandlers
    }
    if (handlers) {
        const handlerNames = handlers.split(',')
        handlerNames.forEach((handlerName) => {
            const handler = handlers[handlerName]
            if (handler) {
                handler(playerSprite, tile)
            }
        })
    }
}

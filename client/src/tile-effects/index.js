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
import { GetScene, BlockedSide } from '../main.js'
import { sceneInstance }  from '../player.js'
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
    if (tile.properties.collideHandlers) {
        const collideHandlerNames = tile.properties.collideHandlers.split(',')
        collideHandlerNames.forEach((handlerName) => {
            const handler = collideHandlers[handlerName]
            if (handler) {
                handler(playerSprite, tile)
            }
        })
    } else if (tile.properties.bumpHandlers && BlockedSide('up')) {
        const bumpHandlerNames = tile.properties.bumpHandlers.split(',')
        bumpHandlerNames.forEach((handlerName) => {
            const handler = bumpHandlers[handlerName]
            if (handler) {
                handler(playerSprite, tile)
            }
        })
    }
}
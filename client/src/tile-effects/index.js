import { left } from './left'
import { right } from './right'
import { up } from './up'
import { down } from './down'

const collideHandlers = {
    up,
    down,
    left,
    right
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
    }
}
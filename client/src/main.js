import 'phaser'
import { ImportPR2Level, MainMenu, Race } from './scenes'
import { Router } from './router'

const config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 800,
    height: 600,
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: true
        }
    },
    scene: [MainMenu, Race, ImportPR2Level]
}
const game = new Phaser.Game(config)

const router = new Router(game, [
    'main-menu',
    'level/:levelId',
    'import-pr2-level'
])

// TODO: wait for some event rather than a static wait time
setTimeout(router.apply, 1000)

window.prf = { router }

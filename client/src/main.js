import 'phaser'
import { ImportPR2Level, MainMenu, Race } from './scenes'

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

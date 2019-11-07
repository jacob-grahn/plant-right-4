export class MainMenu extends Phaser.Scene {

    constructor () {
        super({ key: 'MainMenu' });
    }

    preload () {
    }

    create () {
        this.add.text(100, 100, 'This is the Main Menu', { fill: '#0f0' })
    }
}
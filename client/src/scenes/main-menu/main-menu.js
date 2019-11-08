export class MainMenu extends Phaser.Scene {

    constructor () {
        super({ key: 'MainMenu' });
    }

    preload () {
    }

    create () {
        this.add.text(100, 100, 'This is the Main Menu', { fill: '#0f0' })

        this.add.text(100, 300, 'Import a Level from PR2', { fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('ImportPR2Level') )
    }
}
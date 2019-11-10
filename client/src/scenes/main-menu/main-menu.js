export class MainMenu extends Phaser.Scene {

    constructor () {
        super({ key: 'MainMenu' });
    }

    preload () {
    }

    create () {
        this.add.text(100, 100, 'This is the Main Menu', { fill: '#00f' })

        this.add.text(100, 200, 'Play', { fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('Race') )

        this.add.text(100, 300, 'Import a Level from PR2', { fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('ImportPR2Level') )
    }
}
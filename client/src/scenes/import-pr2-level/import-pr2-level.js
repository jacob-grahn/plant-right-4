export class ImportPR2Level extends Phaser.Scene {

    constructor () {
        super({ key: 'ImportPR2Level' });
    }

    preload () {
    }

    create () {
        this.add.text(100, 100, 'Main Menu', { fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('MainMenu') );
    }
}
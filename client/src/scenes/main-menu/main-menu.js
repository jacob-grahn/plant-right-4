export class MainMenu extends Phaser.Scene {

    constructor () {
        super({ key: 'main-menu' });
    }

    preload () {
    }

    create () {
        this.add.text(100, 100, 'This is the Main Menu', { fill: '#00f' })

        const levelId = 6497061
        this.add.text(100, 200, 'Play', { fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => window.prf.router.go(`level/${levelId}`))

        this.add.text(100, 300, 'Import a Level from PR2', { fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => window.prf.router.go('import-pr2-level') )
    }
}
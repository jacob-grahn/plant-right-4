export class ImportPR2Level extends Phaser.Scene {

    constructor () {
        super({ key: 'import-pr2-level' });
    }

    preload () {
        this.load.html('import-pr2-level', 'assets/html/import-pr2-level.html')
    }

    create () {
        this.add.text(100, 100, 'Main Menu', { fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => window.prf.router.go('main-menu'))

        var element = this.add.dom(400, 0).createFromCache('import-pr2-level')
        element.addListener('click')

        this.tweens.add({
            targets: element,
            y: 300,
            duration: 2000,
            ease: 'Power3'
        })

        element.on('click', function (event) {
            if (event.target.name === 'importButton') {
                const inputElement = this.getChildByName('levelIdInput')
                const levelId = inputElement.value
                if (levelId) {
                    fetch(`https://hlnoli4gfl.execute-api.us-east-1.amazonaws.com/dev/import-from-pr2/${levelId}`)
                }
            }
        })
    }
}
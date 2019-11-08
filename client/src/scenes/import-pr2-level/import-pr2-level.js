export class ImportPR2Level extends Phaser.Scene {

    constructor () {
        super({ key: 'ImportPR2Level' });
    }

    preload () {
        this.load.html('main-menu', 'assets/html/main-menu.html')
    }

    create () {
        this.add.text(100, 100, 'Main Menu', { fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('MainMenu'))

        var element = this.add.dom(400, 0).createFromCache('main-menu')
        element.addListener('click')

        this.tweens.add({
            targets: element,
            y: 300,
            duration: 2000,
            ease: 'Power3'
        })

        element.on('click', function (event) {
            console.log('click', event)
            if (event.target.name === 'importButton') {
                const inputElement = this.getChildByName('levelIdInput')
                const inputText = inputElement.value
                if (inputText) {
                    console.log(inputText)
                }
            }
        })
    }
}